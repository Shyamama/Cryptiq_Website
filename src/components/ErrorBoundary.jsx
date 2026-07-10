import React from "react";

// Renders the fallback (nothing, by default) if a child throws — used for
// decorative subtrees like the lattice canvas, whose failure must never
// blank the whole page.
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
