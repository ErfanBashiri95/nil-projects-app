export default function NilLogoFixed() {
  return (
    <img
      src="/nil-project/nil-logo.png"
      alt="NIL Logo"
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        width: "120px",
        opacity: 1,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    />
  );
}
