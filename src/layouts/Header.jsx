import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

          <button className="text-2xl hover:scale-110 transition">
            👤
          </button>

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