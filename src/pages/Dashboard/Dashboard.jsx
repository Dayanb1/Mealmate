import DashboardCard from "../../components/DashboardCard.jsx";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import MonthNavigation from "../../components/Calendar/MonthNavigation";

function Dashboard({
  mealData,
  mealPrice,
  monthlyAdvance,
  selectedDate,
  setSelectedDate,
}) {
  const { user } = useAuth();

  const [previousDues, setPreviousDues] = useState([]);
  const [totalPreviousDue, setTotalPreviousDue] = useState(0);

  useEffect(() => {
    loadPreviousDues();
  }, [user, selectedDate]);

  async function loadPreviousDues() {
    if (!user) return;

    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth() + 1;

    // Get all monthly settings for the current user
    const { data: settingsData, error: settingsError } = await supabase
      .from("monthly_settings")
      .select("*")
      .eq("user_id", user.id);

    if (settingsError) {
      console.error(settingsError);
      return;
    }

    // Get all meals before the selected month
    const currentMonthStart = `${currentYear}-${String(
      currentMonth
    ).padStart(2, "0")}-01`;

    const { data: mealsData, error: mealsError } = await supabase
      .from("meals_v2")
      .select("*")
      .eq("user_id", user.id)
      .lt("meal_date", currentMonthStart);

    if (mealsError) {
      console.error(mealsError);
      return;
    }

    // Group meals by month
    const monthlyMeals = {};

    mealsData.forEach((meal) => {
      const monthKey = meal.meal_date.slice(0, 7);

      if (!monthlyMeals[monthKey]) {
        monthlyMeals[monthKey] = 0;
      }

      if (meal.status === "🍛 Ate Meal") {
        monthlyMeals[monthKey]++;
      }
    });

    // Previous months from oldest to newest
    const previousSettings = settingsData
      .filter((item) => {
        if (!item.month || !item.year) return false;

        if (item.year < currentYear) return true;

        return item.year === currentYear && item.month < currentMonth;
      })
      .sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }

        return a.month - b.month;
      });

    let runningDue = 0;
    const pendingMonths = [];

    previousSettings.forEach((setting) => {
      const monthKey = `${setting.year}-${String(
        setting.month
      ).padStart(2, "0")}`;

      const meals = monthlyMeals[monthKey] || 0;

      const bill =
        meals * Number(setting.meal_price || 0);

      const advance =
        Number(setting.monthly_advance || 0);

      // Carry previous due forward
      runningDue = runningDue + bill - advance;

      if (runningDue > 0) {
        pendingMonths.push({
          month: setting.month,
          year: setting.year,
          amount: runningDue,
        });
      } else {
        runningDue = 0;
      }
    });

    // Show latest 3 months with pending dues
    const latestThree = pendingMonths
      .slice(-3)
      .reverse();

    setPreviousDues(latestThree);
    setTotalPreviousDue(runningDue);
  }

  const totalMeals = Object.values(mealData).filter(
    (status) => status === "🍛 Ate Meal"
  ).length;

  const currentBill = totalMeals * mealPrice;

  const totalDays = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const completedDays = Object.values(mealData).filter(
    (status) => status
  ).length;

  const pendingDays = totalDays - completedDays;

  const remainingBalance = monthlyAdvance - currentBill;

  const totalAmountToSettle =
    totalPreviousDue + currentBill;

  const balanceColor =
    remainingBalance >= 0
      ? "#16a34a"
      : "#dc2626";

  const balanceTitle =
    remainingBalance >= 0
      ? "Advance Left"
      : "Need To Pay";

  return (
    <div className="premium-dashboard relative space-y-8 pb-10">

      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="pointer-events-none absolute top-96 -left-20 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

      {/* 3D HERO SECTION */}
      <div className="premium-section relative min-h-[460px] overflow-hidden rounded-3xl">

        {/* Generated 3D scene */}
        <img
          src="/dashboard/mealmate-scene.png"
          alt="MealMate 3D healthy meal scene"
          className="absolute inset-0 h-full w-full object-cover"
        />

      

        {/* Hero content */}
        <div className="relative z-10 p-8 md:p-10">

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-purple-600">
            MealMate • Personal Dashboard
          </p>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-md text-slate-600">
            Welcome back! Here's your meal summary.
          </p>

          {/* Month Navigation */}
          <div className="mt-8 max-w-xl">
            <MonthNavigation
              currentDate={selectedDate}
              setCurrentDate={setSelectedDate}
            />
          </div>

        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

        {/* Meals */}
        <div className="premium-card premium-shimmer premium-float rounded-3xl">
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-green-400 to-lime-300" />

          <div className="p-5">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                🍛
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Meals
              </span>

            </div>

            <p className="text-sm text-slate-500">
              Meals This Month
            </p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              {totalMeals}
            </p>

          </div>
        </div>

        {/* Billing */}
        <div className="premium-card premium-shimmer rounded-3xl">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-400" />

          <div className="p-5">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                💳
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Billing
              </span>

            </div>

            <p className="text-sm text-slate-500">
              Current Bill
            </p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              ₹{currentBill}
            </p>

          </div>
        </div>

        {/* Advance */}
        <div className="premium-card premium-shimmer rounded-3xl">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300" />

          <div className="p-5">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                💰
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Advance
              </span>

            </div>

            <p className="text-sm text-slate-500">
              Monthly Advance
            </p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              ₹{monthlyAdvance}
            </p>

          </div>
        </div>

        {/* Balance */}
        <div className="premium-card premium-glow rounded-3xl">

          <div
            className={`h-1.5 ${
              remainingBalance >= 0
                ? "bg-gradient-to-r from-emerald-500 to-green-300"
                : "bg-gradient-to-r from-red-600 to-orange-400"
            }`}
          />

          <div className="p-5">

            <div className="mb-4 flex items-center justify-between">

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl ${
                  remainingBalance >= 0
                    ? "bg-emerald-100"
                    : "bg-red-100"
                }`}
              >
                {remainingBalance >= 0 ? "✅" : "⚠️"}
              </div>

              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  remainingBalance >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {balanceTitle}
              </span>

            </div>

            <p className="text-sm text-slate-500">
              {balanceTitle}
            </p>

            <p
              className={`premium-number mt-2 text-4xl font-black ${
                remainingBalance >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              ₹{Math.abs(remainingBalance)}
            </p>

          </div>
        </div>

        {/* Pending Days */}
        <div className="premium-card rounded-3xl">

          <div className="h-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-orange-300" />

          <div className="p-5">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-xl">
                📅
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                Days
              </span>

            </div>

            <p className="text-sm text-slate-500">
              Pending Days
            </p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              {pendingDays}
            </p>

          </div>
        </div>

      </div>

      {/* MAIN SECTIONS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* MONTHLY SUMMARY */}
        <div className="premium-section premium-glow rounded-3xl p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
                Overview
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Monthly Summary
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl text-white shadow-lg">
              📊
            </div>

          </div>

          <div className="space-y-4">

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Meal Price
              </span>

              <span className="font-bold text-slate-900">
                ₹{mealPrice}
              </span>
            </div>

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Meals Eaten
              </span>

              <span className="font-bold text-emerald-600">
                {totalMeals}
              </span>
            </div>

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Meal Cost
              </span>

              <span className="font-bold text-blue-600">
                ₹{currentBill}
              </span>
            </div>

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Advance
              </span>

              <span className="font-bold text-orange-600">
                ₹{monthlyAdvance}
              </span>
            </div>

            <div className="premium-divider my-5" />

            <div
              className={`rounded-2xl p-5 ${
                remainingBalance >= 0
                  ? "bg-gradient-to-br from-emerald-50 to-green-100"
                  : "bg-gradient-to-br from-red-50 to-orange-100"
              }`}
            >

              <div className="flex items-center justify-between">

                <span className="font-bold text-slate-700">
                  {balanceTitle}
                </span>

                <span
                  className={`text-2xl font-black ${
                    remainingBalance >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{Math.abs(remainingBalance)}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* TOTAL SETTLEMENT */}
        <div className="premium-section premium-glow relative overflow-hidden rounded-3xl p-6">

          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative z-10">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                  Settlement
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Total Amount to Settle
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-xl text-white shadow-lg">
                💰
              </div>

            </div>

            {/* Main Amount */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-7 text-white shadow-2xl">

              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-400/20 blur-3xl" />

              <p className="relative text-sm font-medium text-slate-300">
                Total amount for this month
              </p>

              <p className="premium-number relative mt-2 text-5xl font-black tracking-tight">
                ₹{totalAmountToSettle}
              </p>

              <p className="relative mt-2 text-xs text-slate-400">
                Previous pending dues + current month bill
              </p>

            </div>

            {/* Breakdown */}
            <div className="mt-6 space-y-3">

              <div className="premium-card flex items-center justify-between rounded-2xl p-4">

                <span className="text-slate-500">
                  Previous Pending Due
                </span>

                <span className="font-bold text-red-600">
                  ₹{totalPreviousDue}
                </span>

              </div>

              <div className="premium-card flex items-center justify-between rounded-2xl p-4">

                <span className="text-slate-500">
                  Current Month Bill
                </span>

                <span className="font-bold text-blue-600">
                  ₹{currentBill}
                </span>

              </div>

              <div className="premium-card flex items-center justify-between rounded-2xl p-4">

                <span className="text-slate-500">
                  Current Month Advance
                </span>

                <span className="font-bold text-emerald-600">
                  - ₹{monthlyAdvance}
                </span>

              </div>

            </div>

            {/* Previous Pending Dues */}
            {previousDues.length > 0 && (
              <div className="mt-7">

                <div className="premium-divider mb-6" />

                <div className="mb-4">

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                    History
                  </p>

                  <h3 className="mt-1 text-lg font-black text-slate-900">
                    Previous Pending Dues
                  </h3>

                </div>

                <div className="space-y-3">

                  {previousDues.map((due, index) => (
                    <div
                      key={`${due.year}-${due.month}`}
                      className="premium-card flex items-center justify-between rounded-2xl border-red-100 bg-gradient-to-r from-red-50 to-orange-50 p-4"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 font-bold text-red-600">
                          {index + 1}
                        </div>

                        <div>

                          <p className="font-bold text-slate-800">
                            {new Date(
                              due.year,
                              due.month - 1
                            ).toLocaleString("en-IN", {
                              month: "long",
                              year: "numeric",
                            })}
                          </p>

                          <p className="text-xs text-slate-500">
                            Pending balance
                          </p>

                        </div>

                      </div>

                      <span className="font-black text-red-600">
                        ₹{due.amount}
                      </span>

                    </div>
                  ))}

                </div>

              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;