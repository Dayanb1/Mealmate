function Header() {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>Welcome Dayanand 👋</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "22px",
        }}
      >
        🔔
        🌙
        👤
      </div>
    </div>
  );
}

export default Header;