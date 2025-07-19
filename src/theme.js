// Emotion theme for the app
const theme = {
  colors: {
    primary: "#4F8CFF",
    primaryDark: "#2563eb",
    secondary: "#F5A623",
    background: "#F7FAFC",
    card: "#fff",
    border: "#E2E8F0",
    text: "#22223B",
    muted: "#6B7280",
    error: "#EF4444",
    success: "#22C55E",
    gradient: "linear-gradient(90deg, #4F8CFF 0%, #6EE7B7 100%)",
  },
  spacing: [0, 4, 8, 16, 24, 32, 40, 48, 64],
  radii: {
    sm: "6px",
    md: "12px",
    lg: "20px",
    round: "50%",
  },
  shadows: {
    card: "0 4px 24px rgba(79, 140, 255, 0.08)",
    hover: "0 8px 32px rgba(79, 140, 255, 0.15)",
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1200px",
  },
  transitions: {
    base: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
  },
};

export default theme;
