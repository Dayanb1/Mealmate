import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#1f2937",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ marginBottom: "40px" }}>🍛 MealMate</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Link to="/" style={linkStyle}>🏠 Dashboard</Link>

        <Link to="/calendar" style={linkStyle}>📅 Calendar</Link>
        <Link to="/bills">
  💰 Bills
</Link>

        

        <Link to="/reports" style={linkStyle}>📊 Reports</Link>

        <Link to="/settings" style={linkStyle}>⚙ Settings</Link>
        
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};

export default Sidebar;