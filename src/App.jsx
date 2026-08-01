
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Bills from "./pages/Bills/Bills";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";

import Dashboard from "./pages/Dashboard/Dashboard";
import Calendar from "./pages/Calendar/Calendar";

import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";

function App() {
  const { user } = useAuth();
  const [mealData, setMealData] = useState({});
  const [selectedDate, setSelectedDate] = useState(() => {
  const savedDate = localStorage.getItem("selectedDate");

  if (savedDate) {
    return new Date(savedDate);
  }

  return new Date();
});
  const [mealPrice, setMealPrice] = useState(80); 
  const [monthlyAdvance, setMonthlyAdvance] = useState(1000);
  

useEffect(() => {
  if (user) {
    loadSettings();
    loadMeals();
  }
}, [selectedDate, user]);
useEffect(() => {
  localStorage.setItem(
    "selectedDate",
    selectedDate.toISOString()
  );
}, [selectedDate]);

async function loadSettings() {
  if (!user) return;

  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const { data, error } = await supabase
    .from("monthly_settings")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    setMealPrice(data.meal_price);
    setMonthlyAdvance(data.monthly_advance);
  } else {
    setMealPrice(0);
    setMonthlyAdvance(0);
  }
}
async function loadMeals() {
  if (!user) return;

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

  const startDate = `${year}-${month}-01`;

  const lastDay = new Date(
    year,
    Number(month),
    0
  ).getDate();

  const endDate = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("meals_v2")
    .select("*")
    .eq("user_id", user.id)
    .gte("meal_date", startDate)
    .lte("meal_date", endDate);

  if (error) {
    console.error(error);
    return;
  }

  const meals = {};

  data.forEach((item) => {
    const day = new Date(item.meal_date).getDate();
    meals[day] = item.status;
  });

  setMealData(meals);
}
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100">

        <Sidebar />

        <div className="flex-1">

          <Header />

          <main className="p-8">

            <Routes>
              <Route
  path="/bills"
  element={
    <ProtectedRoute>
  <Bills
    mealData={mealData}
    mealPrice={mealPrice}
    monthlyAdvance={monthlyAdvance}
    selectedDate={selectedDate}
  />
</ProtectedRoute>
  }
/>

              <Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />
              <Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard
        mealData={mealData}
        mealPrice={mealPrice}
        monthlyAdvance={monthlyAdvance}
        selectedDate={selectedDate}
      />
    </ProtectedRoute>
  }
/>

              <Route
  path="/calendar"
  element={
    <ProtectedRoute>
  <Calendar
    mealData={mealData}
    setMealData={setMealData}
    selectedDate={selectedDate}
    setSelectedDate={setSelectedDate}
    loadMeals={loadMeals}
  />
</ProtectedRoute>
  }
/>

              

              <Route path="/reports"
  element={
    <ProtectedRoute>
  <Reports
    mealData={mealData}
    mealPrice={mealPrice}
    monthlyAdvance={monthlyAdvance}
    selectedDate={selectedDate}
  />
</ProtectedRoute>
  } />

              <Route
  path="/settings"
  element={
    <ProtectedRoute>
  <Settings
    selectedDate={selectedDate}
  />
</ProtectedRoute>
  }
/>

            </Routes>

          </main>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;