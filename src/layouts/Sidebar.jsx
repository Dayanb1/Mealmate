import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", icon: "🏠", path: "/" },
    { name: "Calendar", icon: "📅", path: "/calendar" },
    { name: "Bills", icon: "💰", path: "/bills" },
    { name: "Reports", icon: "📊", path: "/reports" },
    { name: "Settings", icon: "⚙", path: "/settings" },
  ];

  return (
    <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col min-h-screen shadow-xl">

      <div className="p-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold">
          🍛 MealMate
        </h1>

        <p className="text-gray-400 text-sm mt-2">
          Meal Tracking System
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">

        {menus.map((menu) => (
          <Link
            key={menu.path}
            to={menu.path}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
              location.pathname === menu.path
                ? "bg-green-600"
                : "hover:bg-gray-800"
            }`}
          >
            <span className="text-xl">
              {menu.icon}
            </span>

            <span className="font-medium">
              {menu.name}
            </span>
          </Link>
        ))}

      </nav>

      <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
        Version 1.0
      </div>

    </aside>
  );
}

export default Sidebar;