import React, { useRef, useEffect, useCallback } from "react";

const CONNECTION_DIST = 190;

// Readability tuning — brighter lattice overall, with a tight veil that
// only darkens the area directly behind text instead of the whole screen.
const LINE_MAX_ALPHA = 0.28;   // was 0.4 originally, 0.14 too dim
const GLOW_ALPHA = 0.18;       // was 0.25 originally, 0.10 too dim
const NODE_MIN_OPACITY = 0.32; // was 0.4 originally, 0.22 too dim
const NODE_OPACITY_SPREAD = 0.34; // was 0.4 originally, 0.28 too dim

function getNodeCount(width) {
  // Fewer nodes on small/mobile screens to protect frame rate,
  // more on desktop for denser full-screen coverage.
  if (width < 640) return 55;
  if (width < 1024) return 85;
  return 130;
}

function createNodes(width, height, phase, count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const centerX = width / 2;
    const centerY = height / 2;
    let x, y;

    if (phase === "center") {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      // Wider radius so the "center" formation reaches further
      // across the viewport instead of staying tightly clustered.
      const radius = 40 + Math.random() * Math.min(width, height) * 0.46;
      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * radius;
    } else {
      // Spread across the full width in bands, not just narrow
      // 10%-wide strips at the very edges.
      const side = i % 2 === 0 ? 0 : 1;
      x = side === 0
        ? Math.random() * width * 0.32
        : width - Math.random() * width * 0.32;
      y = Math.random() * height;
    }

    nodes.push({
      x, y,
      targetX: x,
      targetY: y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: 2 + Math.random() * 2,
      opacity: NODE_MIN_OPACITY + Math.random() * NODE_OPACITY_SPREAD,
    });
  }
  return nodes;
}

// progressRef is a React ref whose .current holds the 0..1 scroll progress.
// Taking a ref instead of a number keeps scroll updates out of React
// rendering entirely — the rAF loop reads it fresh every frame.
export default function LatticeCanvas({ progressRef }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef(null);
  const centerNodesRef = useRef(null);
  const sideNodesRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });

  const initNodes = useCallback((w, h) => {
    const count = getNodeCount(w);
    centerNodesRef.current = createNodes(w, h, "center", count);
    sideNodesRef.current = createNodes(w, h, "side", count);
    nodesRef.current = centerNodesRef.current.map(n => ({ ...n }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Honor prefers-reduced-motion: draw a single static lattice frame
    // (plus one per resize) instead of running the animation loop, and
    // skip the pointer-repulsion listeners entirely.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      const prevW = sizeRef.current.w;
      sizeRef.current = { w, h };
      // Mobile browsers fire resize when the URL bar expands/collapses
      // while scrolling — a height-only change. Regenerating the node
      // formations then makes the whole lattice visibly scramble, so only
      // rebuild when the width changes (real resize or rotation).
      if (w !== prevW) initNodes(w, h);
      // No animation loop in reduced-motion mode, so redraw explicitly.
      // (Safe here: resize is first invoked after animate is defined.)
      if (prefersReduced) requestAnimationFrame(animate);
    };

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Touch support — without this, phones/tablets never trigger the
    // repulsion effect since they never fire mousemove.
    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    if (!prefersReduced) {
      window.addEventListener("mousemove", handleMouse);
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    const animRefTime = { last: null };

    const animate = (now) => {
      const { w, h } = sizeRef.current;
      const progress = progressRef?.current ?? 0;
      const nodes = nodesRef.current;
      const center = centerNodesRef.current;
      const side = sideNodesRef.current;

      if (!nodes || !center || !side) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      // Delta-time normalization — without this, motion speed is tied to
      // actual frame rate. A busier page (more DOM, more competing scripts)
      // can run at a lower real FPS than local dev, which would otherwise
      // make the lattice visibly slower and less responsive to the mouse,
      // even though the code is identical. Normalizing to a 60fps baseline
      // keeps the motion speed consistent no matter the real frame rate.
      if (animRefTime.last === null) animRefTime.last = now;
      const rawDelta = now - animRefTime.last;
      animRefTime.last = now;
      // Clamp to avoid a huge jump after a tab was backgrounded/throttled,
      // and guard against any non-finite timestamp ever reaching the math
      // below (which would otherwise NaN-out every node position and
      // crash the canvas draw calls).
      const safeDelta = Number.isFinite(rawDelta) ? rawDelta : 16.67;
      const dt = Math.min(Math.max(safeDelta, 0), 50) / (1000 / 60); // ~1.0 at 60fps

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Interpolate node positions
      for (let i = 0; i < nodes.length; i++) {
        const c = center[i];
        const s = side[i];
        const t = Math.min(1, Math.max(0, progress));
        nodes[i].targetX = c.x + (s.x - c.x) * t;
        nodes[i].targetY = c.y + (s.y - c.y) * t;

        // Mouse repulsion
        const dx = nodes[i].x - mx;
        const dy = nodes[i].y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 3 * dt;
          nodes[i].x += (dx / dist) * force;
          nodes[i].y += (dy / dist) * force;
        }

        // Ease toward target
        const ease = 1 - Math.pow(1 - 0.04, dt);
        nodes[i].x += (nodes[i].targetX - nodes[i].x) * ease;
        nodes[i].y += (nodes[i].targetY - nodes[i].y) * ease;

        // Drift
        nodes[i].x += nodes[i].vx * dt;
        nodes[i].y += nodes[i].vy * dt;

        // Boundary wrap
        if (nodes[i].x < -30) nodes[i].x = w + 30;
        if (nodes[i].x > w + 30) nodes[i].x = -30;
        if (nodes[i].y < -30) nodes[i].y = h + 30;
        if (nodes[i].y > h + 30) nodes[i].y = -30;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const proximity = 1 - dist / CONNECTION_DIST;
            const alpha = proximity * LINE_MAX_ALPHA;
            // Accent tint on stronger connections
            const r = 120 + Math.floor(proximity * 75);
            const g = 170 + Math.floor(proximity * 50);
            const b = 230;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.6 + proximity * 0.3;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with glow
      for (let i = 0; i < nodes.length; i++) {
        // Glow
        const glow = ctx.createRadialGradient(
          nodes[i].x, nodes[i].y, 0,
          nodes[i].x, nodes[i].y, nodes[i].radius * 3
        );
        glow.addColorStop(0, `rgba(130, 180, 240, ${nodes[i].opacity * GLOW_ALPHA})`);
        glow.addColorStop(1, "rgba(130, 180, 240, 0)");
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nodes[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 226, 226, ${nodes[i].opacity})`;
        ctx.fill();
      }

      if (!prefersReduced) animRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!prefersReduced) animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animRef.current);
    };
  }, [initNodes]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "transparent" }}
      />
      {/* Readability veil — sits above the lattice, below content.
          Tight and dark directly behind the text column, but falls off
          fast, so the lattice keeps its brightness everywhere else. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 42% 38% at 50% 45%, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0.4) 45%, rgba(8,8,8,0) 78%)",
        }}
      />
    </>
  );
}