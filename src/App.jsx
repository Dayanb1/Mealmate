import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";

import Dashboard from "./pages/Dashboard/Dashboard";
import Calendar from "./pages/Calendar/Calendar";
import Hotels from "./pages/Hotels/Hotels";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function App() {
  const [mealData, setMealData] = useState({});
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">

        <Sidebar />

        <div className="flex-1">

          <Header />

          <main className="p-8">

            <Routes>

              <Route path="/"
  element={
    <Dashboard
      mealData={mealData}
    />
  } />

              <Route path="/calendar"
  element={
    <Calendar
      mealData={mealData}
      setMealData={setMealData}
    />
  } />

              <Route path="/hotels" element={<Hotels />} />

              <Route path="/reports" element={<Reports />} />

              <Route path="/settings" element={<Settings />} />

            </Routes>

          </main>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;