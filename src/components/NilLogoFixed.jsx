export default function NilLogoFixed() {
    return (
      <img
        src="/nil-logo.png" // همون فایلی که تو public گذاشتی
        alt="NIL Logo"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          width: "120px",
          opacity: 1,
          zIndex: 9999,
          pointerEvents: "none", // که روش کلیک نشه
        }}
      />
    );
  }
  