import { Link, useLocation } from "react-router-dom";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", icon: "🏠", path: "/" },
    { name: "Calendar", icon: "📅", path: "/calendar" },
    { name: "Bills", icon: "💰", path: "/bills" },
    { name: "Reports", icon: "📊", path: "/reports" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  return (
    <aside
      className={`
        hidden md:flex
        ${sidebarOpen ? "w-64" : "w-20"}
        bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950
        text-white
        flex-col
        min-h-screen
        shadow-2xl
        border-r border-white/10
        transition-all duration-300 ease-in-out
        relative
        z-50
      `}
    >
      {/* Logo / Menu button */}
      <div
        className={`
          border-b border-white/10
          transition-all duration-300
          ${sidebarOpen ? "p-6" : "p-4"}
        `}
      >
        <div
          className={`
            flex items-center
            ${sidebarOpen ? "justify-between" : "justify-center"}
          `}
        >
          {sidebarOpen ? (
            <>
              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  🍛 MealMate
                </h1>

                <p className="text-slate-400 text-xs mt-2">
                  Meal Tracking System
                </p>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="text-xl text-slate-300 hover:text-white hover:scale-110 transition"
                title="Collapse sidebar"
              >
                ☰
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl hover:scale-110 transition"
              title="Open sidebar"
            >
              ☰
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {menus.map((menu) => {
          const active = location.pathname === menu.path;

          return (
            <Link
              key={menu.path}
              to={menu.path}
              title={!sidebarOpen ? menu.name : ""}
              className={`
                group
                relative
                flex items-center
                ${sidebarOpen ? "gap-4 px-4" : "justify-center"}
                py-3
                rounded-2xl
                transition-all duration-300
                ${
                  active
                    ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-lg shadow-purple-900/30"
                    : "hover:bg-white/10"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-white" />
              )}

              <span
                className={`
                  text-2xl
                  transition-transform duration-300
                  group-hover:scale-125
                  ${active ? "scale-110" : ""}
                `}
              >
                {menu.icon}
              </span>

              {sidebarOpen && (
                <span className="font-semibold text-sm">
                  {menu.name}
                </span>
              )}

              {!sidebarOpen && (
                <span
                  className="
                    absolute left-16
                    hidden group-hover:block
                    whitespace-nowrap
                    rounded-lg
                    bg-slate-950
                    px-3 py-2
                    text-xs font-semibold
                    shadow-xl
                    border border-white/10
                  "
                >
                  {menu.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className={`
          border-t border-white/10
          text-center text-slate-500 text-xs
          transition-all duration-300
          ${sidebarOpen ? "p-4" : "p-3"}
        `}
      >
        {sidebarOpen ? (
          <>
            <p>MealMate</p>
            <p className="mt-1">Version 1.0</p>
          </>
        ) : (
          <span>1.0</span>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;