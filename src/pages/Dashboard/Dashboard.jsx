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

  const [carryHistory, setCarryHistory] = useState([]);
  const [previousCarryBalance, setPreviousCarryBalance] = useState(0);

  useEffect(() => {
    loadCarryHistory();
  }, [user, selectedDate]);

  async function loadCarryHistory() {
    if (!user) {
      setCarryHistory([]);
      setPreviousCarryBalance(0);
      return;
    }

    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth() + 1;

    // Fetch all monthly settings for this user.
    const { data: settingsData, error: settingsError } = await supabase
      .from("monthly_settings")
      .select("*")
      .eq("user_id", user.id);

    if (settingsError) {
      console.error("Failed to load monthly settings:", settingsError);
      return;
    }

    // Fetch meals before the selected month.
    const currentMonthStart =
      `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;

    const { data: mealsData, error: mealsError } = await supabase
      .from("meals_v2")
      .select("*")
      .eq("user_id", user.id)
      .lt("meal_date", currentMonthStart);

    if (mealsError) {
      console.error("Failed to load historical meals:", mealsError);
      return;
    }

    // Group meals by month.
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

    // Process previous months chronologically.
    const previousSettings = (settingsData || [])
      .filter((setting) => {
        if (!setting.month || !setting.year) return false;

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

    // Positive balance = money still owed.
    // Negative balance = unused advance credit.
    let runningBalance = 0;
    const history = [];

    previousSettings.forEach((setting) => {
      const monthKey =
        `${setting.year}-${String(setting.month).padStart(2, "0")}`;

      const meals = monthlyMeals[monthKey] || 0;
      const bill = meals * Number(setting.meal_price || 0);
      const advance = Number(setting.monthly_advance || 0);

      const openingBalance = runningBalance;

      // Carry both debt and credit into the next month.
      runningBalance = openingBalance + bill - advance;

      history.push({
        month: Number(setting.month),
        year: Number(setting.year),
        bill,
        advance,
        openingBalance,
        closingBalance: runningBalance,
      });
    });

    setCarryHistory(history);
    setPreviousCarryBalance(runningBalance);
  }

  // Current selected month's calculations.
  const totalMeals = Object.values(mealData).filter(
    (status) => status === "🍛 Ate Meal"
  ).length;

  const currentBill = totalMeals * Number(mealPrice || 0);
  const currentAdvance = Number(monthlyAdvance || 0);

  const totalDays = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const completedDays = Object.values(mealData).filter(
    (status) => status
  ).length;

  const pendingDays = totalDays - completedDays;

  // Positive means a due; negative means available credit.
  const currentMonthCarryBalance =
    previousCarryBalance + currentBill - currentAdvance;

  // Amount remaining to cover before using this month's advance.
  const amountBeforeAdvance =
    previousCarryBalance + currentBill;

  const totalAmountToSettle = Math.max(amountBeforeAdvance, 0);

  // Keep the original card's sign convention:
  // positive remainingBalance = advance credit,
  // negative remainingBalance = amount still due.
  const remainingBalance = -currentMonthCarryBalance;

  const balanceTitle =
    remainingBalance >= 0 ? "Advance Left" : "Need To Pay";

  const carryTitle =
    currentMonthCarryBalance > 0
      ? "Amount Due to Carry Forward"
      : currentMonthCarryBalance < 0
        ? "Advance Credit to Carry Forward"
        : "Month Fully Settled";

  const carryDescription =
    currentMonthCarryBalance > 0
      ? "Unpaid amount carried into the next month"
      : currentMonthCarryBalance < 0
        ? "Unused advance available next month"
        : "No outstanding due or credit";

  const carryColor =
    currentMonthCarryBalance > 0
      ? "text-red-600"
      : currentMonthCarryBalance < 0
        ? "text-emerald-600"
        : "text-indigo-600";

  const carryBackground =
    currentMonthCarryBalance > 0
      ? "from-red-50 to-orange-50 border-red-100"
      : currentMonthCarryBalance < 0
        ? "from-emerald-50 to-green-100 border-emerald-100"
        : "from-indigo-50 to-purple-50 border-indigo-100";

  // Current month at the top, followed by all previous months.
  const displayedHistory = [
    {
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
      bill: currentBill,
      advance: currentAdvance,
      openingBalance: previousCarryBalance,
      closingBalance: currentMonthCarryBalance,
      isCurrentMonth: true,
    },
    ...carryHistory.slice().reverse(),
  ];

  return (
    <div className="premium-dashboard relative space-y-8 pb-10">

      {/* Background glow */}
      <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="pointer-events-none absolute top-96 -left-20 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />

      {/* HERO SECTION */}
      <div className="premium-section dashboard-nature relative min-h-[460px] overflow-hidden rounded-3xl">

        {/* Opening nature animation */}
        <span className="nature-particle nature-leaf nature-1">🍃</span>
        <span className="nature-particle nature-flower nature-2">🌸</span>
        <span className="nature-particle nature-leaf nature-3">🌿</span>
        <span className="nature-particle nature-flower nature-4">🌼</span>
        <span className="nature-particle nature-leaf nature-5">🍃</span>
        <span className="nature-particle nature-flower nature-6">🌷</span>
        <span className="nature-particle nature-leaf nature-7">🌿</span>

        {/* Original 3D image */}
        <img
          src="/dashboard/mealmate-scene.png"
          alt="MealMate garden and healthy meal scene"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Hero text */}
        <div className="relative z-10 p-8 md:p-10">

          <p className="mb-2 text-sm font-bold uppercase tracking-[0.3em] text-purple-600">
            MealMate • Personal Dashboard
          </p>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-md text-slate-700">
            Welcome back! Here's your meal summary.
          </p>

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

            <p className="text-sm text-slate-500">Meals This Month</p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              {totalMeals}
            </p>
          </div>
        </div>

        {/* Current bill */}
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

            <p className="text-sm text-slate-500">Current Bill</p>

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

            <p className="text-sm text-slate-500">Monthly Advance</p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              ₹{currentAdvance}
            </p>
          </div>
        </div>

        {/* Advance Left / Need To Pay, including previous carry */}
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

            <p className="text-sm text-slate-500">{balanceTitle}</p>

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

        {/* Pending days */}
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

            <p className="text-sm text-slate-500">Pending Days</p>

            <p className="premium-number mt-2 text-4xl font-black text-slate-900">
              {pendingDays}
            </p>
          </div>
        </div>

      </div>

      {/* CARRY FORWARD + SETTLEMENT */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* CARRY FORWARD BALANCE - replaces Monthly Summary */}
        <div className="premium-section premium-glow rounded-3xl p-6">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
                Monthly Balance
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                Carry Forward Balance
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl text-white shadow-lg">
              🔄
            </div>
          </div>

          {/* Main carry balance */}
          <div
            className={`rounded-3xl border bg-gradient-to-br ${carryBackground} p-7`}
          >
            <p className="text-sm font-semibold text-slate-600">
              {carryTitle}
            </p>

            <p className={`premium-number mt-3 text-5xl font-black ${carryColor}`}>
              ₹{Math.abs(currentMonthCarryBalance)}
            </p>

            <p className="mt-3 text-sm text-slate-600">
              {carryDescription}
            </p>
          </div>

          {/* Monthly balance calculation */}
          <div className="mt-6 space-y-3">

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Previous Carry Forward
              </span>

              <span
                className={`font-bold ${
                  previousCarryBalance > 0
                    ? "text-red-600"
                    : previousCarryBalance < 0
                      ? "text-emerald-600"
                      : "text-slate-900"
                }`}
              >
                {previousCarryBalance < 0 ? "Credit " : ""}
                ₹{Math.abs(previousCarryBalance)}
              </span>
            </div>

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Current Month Bill
              </span>

              <span className="font-bold text-blue-600">
                + ₹{currentBill}
              </span>
            </div>

            <div className="premium-card flex items-center justify-between rounded-2xl p-4">
              <span className="text-slate-500">
                Current Month Advance
              </span>

              <span className="font-bold text-emerald-600">
                - ₹{currentAdvance}
              </span>
            </div>
          </div>

          <div className="premium-divider my-6" />

          <p className="text-sm leading-6 text-slate-500">
            Both unpaid balances and unused advance credit are carried
            into the next month automatically.
          </p>
        </div>

        {/* TOTAL AMOUNT TO SETTLE */}
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

            {/* Net amount after prior credit, before current advance */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-7 text-white shadow-2xl">

              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-400/20 blur-3xl" />

              <p className="relative text-sm font-medium text-slate-300">
                Amount to cover after previous credit
              </p>

              <p className="premium-number relative mt-2 text-5xl font-black tracking-tight">
                ₹{totalAmountToSettle}
              </p>

              <p className="relative mt-2 text-xs text-slate-400">
                Previous carry forward + current month bill
              </p>
            </div>

            {/* Settlement breakdown */}
            <div className="mt-6 space-y-3">

              <div className="premium-card flex items-center justify-between rounded-2xl p-4">
                <span className="text-slate-500">
                  Previous Carry Forward
                </span>

                <span
                  className={`font-bold ${
                    previousCarryBalance > 0
                      ? "text-red-600"
                      : previousCarryBalance < 0
                        ? "text-emerald-600"
                        : "text-slate-900"
                  }`}
                >
                  {previousCarryBalance < 0 ? "Credit " : ""}
                  ₹{Math.abs(previousCarryBalance)}
                </span>
              </div>

              <div className="premium-card flex items-center justify-between rounded-2xl p-4">
                <span className="text-slate-500">
                  Current Month Bill
                </span>

                <span className="font-bold text-blue-600">
                  + ₹{currentBill}
                </span>
              </div>

              <div className="premium-card flex items-center justify-between rounded-2xl p-4">
                <span className="text-slate-500">
                  Current Month Advance
                </span>

                <span className="font-bold text-emerald-600">
                  - ₹{currentAdvance}
                </span>
              </div>

            </div>

            {/* Final result */}
            <div
              className={`mt-6 rounded-2xl border p-5 ${
                currentMonthCarryBalance > 0
                  ? "border-red-100 bg-red-50"
                  : currentMonthCarryBalance < 0
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-indigo-100 bg-indigo-50"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-700">
                  {carryTitle}
                </span>

                <span className={`text-2xl font-black ${carryColor}`}>
                  ₹{Math.abs(currentMonthCarryBalance)}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* COMPLETE MONTHLY HISTORY */}
      <div className="premium-section rounded-3xl p-6">

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              History
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Monthly Carry Forward History
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Every month’s bill, advance and balance carried forward.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-xl text-white shadow-lg">
            📚
          </div>
        </div>

        {displayedHistory.length > 0 ? (
          <div className="space-y-4">

            {displayedHistory.map((entry) => {
              const monthName = new Date(
                entry.year,
                entry.month - 1
              ).toLocaleString("en-IN", {
                month: "long",
                year: "numeric",
              });

              const closingBalance = Number(entry.closingBalance || 0);

              const historyTitle =
                closingBalance > 0
                  ? "Due carried forward"
                  : closingBalance < 0
                    ? "Advance credit carried forward"
                    : "Settled";

              const historyColor =
                closingBalance > 0
                  ? "text-red-600"
                  : closingBalance < 0
                    ? "text-emerald-600"
                    : "text-indigo-600";

              const historyBackground =
                closingBalance > 0
                  ? "border-red-100 bg-red-50/60"
                  : closingBalance < 0
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-indigo-100 bg-indigo-50/60";

              return (
                <div
                  key={`${entry.year}-${entry.month}`}
                  className={`premium-card rounded-2xl border p-5 ${historyBackground}`}
                >

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                        {closingBalance > 0
                          ? "🧾"
                          : closingBalance < 0
                            ? "💚"
                            : "✅"}
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          {monthName}
                        </h3>

                        {entry.isCurrentMonth && (
                          <span className="mt-1 inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-700">
                            Selected Month
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-bold ${historyColor}`}>
                        {historyTitle}
                      </p>

                      <p className={`mt-1 text-xl font-black ${historyColor}`}>
                        ₹{Math.abs(closingBalance)}
                      </p>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-xs text-slate-500">
                        Monthly Bill
                      </p>

                      <p className="mt-1 font-bold text-blue-600">
                        ₹{entry.bill}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-xs text-slate-500">
                        Monthly Advance
                      </p>

                      <p className="mt-1 font-bold text-emerald-600">
                        ₹{entry.advance}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white/80 p-3">
                      <p className="text-xs text-slate-500">
                        Opening Carry Forward
                      </p>

                      <p
                        className={`mt-1 font-bold ${
                          entry.openingBalance > 0
                            ? "text-red-600"
                            : entry.openingBalance < 0
                              ? "text-emerald-600"
                              : "text-slate-900"
                        }`}
                      >
                        {entry.openingBalance < 0 ? "Credit " : ""}
                        ₹{Math.abs(Number(entry.openingBalance || 0))}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-3xl">🌱</p>

            <h3 className="mt-3 font-bold text-slate-800">
              No monthly history yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your carry-forward history will appear here as monthly
              settings and meal records are saved.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;