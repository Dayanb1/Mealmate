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
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Welcome 👋
          </h1>

          <p className="text-gray-500 text-sm break-all">
            {user?.email}
          </p>
        </div>

        <div className="flex items-center gap-4">

          <button className="text-2xl hover:scale-110 transition">
            🔔
          </button>

          <button className="text-2xl hover:scale-110 transition">
            🌙
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-2xl hover:scale-110 transition"
            >
              👤
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">

                <h3 className="font-bold text-lg mb-3">
                  Account
                </h3>

                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-800">
                    Logged in as
                  </p>

                  <p className="mt-1 break-all">
                    {user?.email}
                  </p>
                </div>

              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;