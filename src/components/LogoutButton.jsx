export default function LogoutButton({ onLogout }) {
    return (
      <button
        onClick={onLogout}
        style={{
          position: "fixed",
          bottom: "18px",
          left: "18px",
  
          display: "flex",
          alignItems: "center",
          gap: "8px",
  
          padding: "10px 18px",
          borderRadius: "999px",
          border: "none",
  
          background: "linear-gradient(135deg, #1A5BFF, #6A00D4)", // آبی + بنفش پررنگ
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
  
          boxShadow: "0 8px 30px rgba(106, 0, 212, 0.55)", // سایه بنفش پررنگ
          zIndex: 99999,
          transition: "0.25s",
        }}
  
        onMouseEnter={(e) => {
          e.target.style.boxShadow = "0 10px 35px rgba(106, 0, 212, 0.75)";
          e.target.style.transform = "translateY(-2px)";
        }}
  
        onMouseLeave={(e) => {
          e.target.style.boxShadow = "0 8px 30px rgba(106, 0, 212, 0.55)";
          e.target.style.transform = "translateY(0)";
        }}
      >
        {/* آیکون SVG logout */}
        <svg 
          width="18" height="18" fill="#FFFFFF" viewBox="0 0 24 24"
          style={{ opacity: 0.95 }}
        >
          <path d="M16 13v-2H7.83l2.58-2.59L9 7l-5 5 5 5 
            1.41-1.41L7.83 13H16zm3-10H5c-1.1 0-2 .9-2
            2v3h2V5h14v14H5v-3H3v3c0 
            1.1.9 2 2 2h14c1.1 0 2-.9 
            2-2V5c0-1.1-.9-2-2-2z"/>
        </svg>
  
        خروج
      </button>
    );
  }
  