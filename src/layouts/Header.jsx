import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/login");
  }

  return (
    <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4">
      <div className="flex justify-between items-center gap-4">

        {/* Left side */}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">
            Welcome 👋
          </h1>

          <p className="text-gray-500 text-sm break-all">
            {user?.email}
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* Notification */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition hover:bg-slate-100 hover:scale-110"
            title="Notifications"
          >
            🔔
          </button>

          {/* Theme */}
          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition hover:bg-slate-100 hover:scale-110"
            title="Theme"
          >
            🌙
          </button>

          {/* Profile */}
          <div className="relative">

            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl transition hover:bg-slate-100 hover:scale-110"
              title="Account"
            >
              👤
            </button>

            {showProfile && (
              <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">

                <h3 className="text-lg font-bold text-slate-900">
                  Account
                </h3>

                <div className="mt-4 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Logged in as
                  </p>

                  <p className="mt-2 break-all text-sm font-medium text-slate-800">
                    {user?.email}
                  </p>
                </div>

              </div>
            )}

          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 md:px-5 py-2.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default Header;