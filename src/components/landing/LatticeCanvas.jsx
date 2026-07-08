import React, { useRef, useEffect, useCallback } from "react";

const NODE_COUNT = 65;
const CONNECTION_DIST = 180;

// Readability tuning — brighter lattice overall, with a tight veil that
// only darkens the area directly behind text instead of the whole screen.
const LINE_MAX_ALPHA = 0.28;   // was 0.4 originally, 0.14 too dim
const GLOW_ALPHA = 0.18;       // was 0.25 originally, 0.10 too dim
const NODE_MIN_OPACITY = 0.32; // was 0.4 originally, 0.22 too dim
const NODE_OPACITY_SPREAD = 0.34; // was 0.4 originally, 0.28 too dim

function createNodes(width, height, phase) {
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const centerX = width / 2;
    const centerY = height / 2;
    let x, y;

    if (phase === "center") {
      const angle = (i / NODE_COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 50 + Math.random() * Math.min(width, height) * 0.3;
      x = centerX + Math.cos(angle) * radius;
      y = centerY + Math.sin(angle) * radius;
    } else {
      const side = i % 2 === 0 ? 0 : 1;
      const margin = width * 0.06;
      x = side === 0
        ? margin + Math.random() * width * 0.1
        : width - margin - Math.random() * width * 0.1;
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

export default function LatticeCanvas({ scrollProgress = 0 }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef(null);
  const centerNodesRef = useRef(null);
  const sideNodesRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const progressRef = useRef(scrollProgress);

  progressRef.current = scrollProgress;

  const initNodes = useCallback((w, h) => {
    centerNodesRef.current = createNodes(w, h, "center");
    sideNodesRef.current = createNodes(w, h, "side");
    nodesRef.current = centerNodesRef.current.map(n => ({ ...n }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      sizeRef.current = { w, h };
      initNodes(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      const { w, h } = sizeRef.current;
      const progress = progressRef.current;
      const nodes = nodesRef.current;
      const center = centerNodesRef.current;
      const side = sideNodesRef.current;

      if (!nodes || !center || !side) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

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
          const force = (150 - dist) / 150 * 3;
          nodes[i].x += (dx / dist) * force;
          nodes[i].y += (dy / dist) * force;
        }

        // Ease toward target
        nodes[i].x += (nodes[i].targetX - nodes[i].x) * 0.04;
        nodes[i].y += (nodes[i].targetY - nodes[i].y) * 0.04;

        // Drift
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;

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

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [initNodes]);

  return (
    <>
      <canvas
        ref={canvasRef}
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
