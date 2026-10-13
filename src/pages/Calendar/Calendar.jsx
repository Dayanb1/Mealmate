import { useAuth } from "../../context/AuthContext";
import CalendarGrid from "../../components/Calendar/CalendarGrid";
import MonthNavigation from "../../components/Calendar/MonthNavigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import MealModal from "../../components/Calendar/MealModal";

function Calendar({
  mealData,
  setMealData,
  mealPrice,
  monthlyAdvance,
  selectedDate,
  setSelectedDate,
  loadMeals,
}) {
  const { user } = useAuth();

  const [selectedDay, setSelectedDay] = useState(null);
  const [previousCarryBalance, setPreviousCarryBalance] = useState(0);

  // Calculate historical due or credit for the selected month.
  useEffect(() => {
    let cancelled = false;

    async function loadPreviousCarryBalance() {
      setPreviousCarryBalance(0);

      if (!user) {
        return;
      }

      const currentYear = selectedDate.getFullYear();
      const currentMonth = selectedDate.getMonth() + 1;

      const currentMonthStart =
        `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;

      // Load this user's monthly settings.
      const { data: settingsData, error: settingsError } = await supabase
        .from("monthly_settings")
        .select("*")
        .eq("user_id", user.id);

      if (settingsError) {
        console.error("Error loading monthly settings:", settingsError);
        return;
      }

      // Load historical meals before the selected month.
      const { data: mealsData, error: mealsError } = await supabase
        .from("meals_v2")
        .select("*")
        .eq("user_id", user.id)
        .lt("meal_date", currentMonthStart);

      if (mealsError) {
        console.error("Error loading historical meals:", mealsError);
        return;
      }

      // Count meals by month.
      const monthlyMeals = {};

      (mealsData || []).forEach((meal) => {
        const monthKey = meal.meal_date.slice(0, 7);

        if (!monthlyMeals[monthKey]) {
          monthlyMeals[monthKey] = 0;
        }

        if (meal.status === "🍛 Ate Meal") {
          monthlyMeals[monthKey]++;
        }
      });

      // Process months from oldest to newest.
      const previousSettings = (settingsData || [])
        .filter((setting) => {
          if (!setting.month || !setting.year) {
            return false;
          }

          return (
            Number(setting.year) < currentYear ||
            (
              Number(setting.year) === currentYear &&
              Number(setting.month) < currentMonth
            )
          );
        })
        .sort((a, b) => {
          if (Number(a.year) !== Number(b.year)) {
            return Number(a.year) - Number(b.year);
          }

          return Number(a.month) - Number(b.month);
        });

      // Positive balance = amount due.
      // Negative balance = unused advance credit.
      let runningBalance = 0;

      previousSettings.forEach((setting) => {
        const monthKey =
          `${setting.year}-${String(setting.month).padStart(2, "0")}`;

        const meals = monthlyMeals[monthKey] || 0;
        const bill = meals * Number(setting.meal_price || 0);
        const advance = Number(setting.monthly_advance || 0);

        // Preserve both due and credit across months.
        runningBalance = runningBalance + bill - advance;
      });

      if (!cancelled) {
        setPreviousCarryBalance(runningBalance);
      }
    }

    loadPreviousCarryBalance();

    return () => {
      cancelled = true;
    };
  }, [user, selectedDate]);

  // Current selected month calculations.
  const totalMeals = Object.values(mealData).filter(
    (status) => status === "🍛 Ate Meal"
  ).length;

  const currentBill = totalMeals * Number(mealPrice || 0);
  const currentAdvance = Number(monthlyAdvance || 0);

  // Positive = due; negative = available credit.
  const currentMonthCarryBalance =
    previousCarryBalance + currentBill - currentAdvance;

  const remainingBalance = -currentMonthCarryBalance;

  const balanceTitle =
    remainingBalance >= 0 ? "Advance Left" : "Need To Pay";

  const balanceColor =
    remainingBalance >= 0
      ? "text-emerald-600"
      : "text-red-600";

  const balanceBarColor =
    remainingBalance >= 0
      ? "bg-gradient-to-r from-emerald-500 to-green-300"
      : "bg-gradient-to-r from-red-600 to-orange-400";

  function getMealDate(day) {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="premium-dashboard relative space-y-8 pb-10">

      {/* Background accents */}
      <div className="pointer-events-none absolute -top-16 right-10 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />

      {/* Calendar heading */}
      <div className="premium-section relative overflow-hidden rounded-3xl p-6 md:p-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-purple-600">
          MealMate • Monthly Tracking
        </p>

        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Meal Calendar
        </h1>

        <p className="mt-2 text-slate-500">
          Track your meals, monthly spending, and carried-forward balance.
        </p>
      </div>

      {/* MONTHLY SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Meals This Month */}
        <div className="premium-card premium-shimmer rounded-3xl">
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

        {/* Current Bill */}
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

        {/* Monthly Advance */}
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
              ₹{currentAdvance}
            </p>
          </div>
        </div>

        {/* Carry-forward-adjusted balance */}
        <div className="premium-card premium-glow rounded-3xl">
          <div className={`h-1.5 ${balanceBarColor}`} />

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

              <span className={`text-xs font-bold uppercase tracking-wider ${balanceColor}`}>
                {balanceTitle}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              {balanceTitle}
            </p>

            <p className={`premium-number mt-2 text-4xl font-black ${balanceColor}`}>
              ₹{Math.abs(remainingBalance)}
            </p>
          </div>
        </div>

      </div>

      {/* CALENDAR */}
      <div className="premium-section rounded-3xl p-5 md:p-6">

        <MonthNavigation
          currentDate={selectedDate}
          setCurrentDate={setSelectedDate}
        />

        <CalendarGrid
          currentDate={selectedDate}
          mealData={mealData}
          setSelectedDay={setSelectedDay}
        />

      </div>

      {/* MEAL EDIT MODAL */}
      {selectedDay && (
        <MealModal
          selectedDay={selectedDay}
          currentStatus={mealData[selectedDay]}
          onClose={() => setSelectedDay(null)}

          onSave={async (status) => {
            const { error } = await supabase
              .from("meals_v2")
              .upsert(
                {
                  user_id: user.id,
                  meal_date: getMealDate(selectedDay),
                  status,
                },
                {
                  onConflict: "user_id,meal_date",
                }
              );

            if (error) {
              console.error(error);
              alert(error.message);
              return;
            }

            await loadMeals();
            setSelectedDay(null);
          }}

          onDelete={async () => {
            const { error } = await supabase
              .from("meals_v2")
              .delete()
              .eq("user_id", user.id)
              .eq("meal_date", getMealDate(selectedDay));

            if (error) {
              console.error(error);
              alert(error.message);
              return;
            }

            await loadMeals();
            setSelectedDay(null);
          }}
        />
      )}

    </div>
  );
}

export default Calendar;