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
      const monthKey = `${setting.year}-${String(setting.month).padStart(
        2,
        "0"
      )}`;

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
    <div className="space-y-8">

      {/* Dashboard Header + Month Navigation */}
      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back! Here's your meal summary.
        </p>

        <div className="mt-6">
          <MonthNavigation
            currentDate={selectedDate}
            setCurrentDate={setSelectedDate}
          />
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

        <DashboardCard
          title="Meals This Month"
          value={totalMeals}
          color="#16a34a"
        />

        <DashboardCard
          title="Current Bill"
          value={`₹${currentBill}`}
          color="#2563eb"
        />

        <DashboardCard
          title="Advance"
          value={`₹${monthlyAdvance}`}
          color="#ea580c"
        />

        <DashboardCard
          title={balanceTitle}
          value={`₹${Math.abs(remainingBalance)}`}
          color={balanceColor}
        />

        <DashboardCard
          title="Pending Days"
          value={pendingDays}
          color="#dc2626"
        />

      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Monthly Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">
            Monthly Summary
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span>Meal Price</span>
              <span>₹{mealPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Meals Eaten</span>
              <span>{totalMeals}</span>
            </div>

            <div className="flex justify-between">
              <span>Meal Cost</span>
              <span>₹{currentBill}</span>
            </div>

            <div className="flex justify-between">
              <span>Advance</span>
              <span>₹{monthlyAdvance}</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">

              <span>{balanceTitle}</span>

              <span
                className={
                  remainingBalance >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                ₹{Math.abs(remainingBalance)}
              </span>

            </div>

          </div>

        </div>

        {/* Total Amount to Settle */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-2xl font-bold mb-6">
            💰 Total Amount to Settle
          </h2>

          <div className="text-4xl font-bold text-red-600 mb-6">
            ₹{totalAmountToSettle}
          </div>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Previous Pending Due</span>

              <span className="font-semibold">
                ₹{totalPreviousDue}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Current Month Bill</span>

              <span className="font-semibold">
                ₹{currentBill}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Current Month Advance</span>

              <span className="font-semibold text-green-600">
                - ₹{monthlyAdvance}
              </span>
            </div>

          </div>

          {/* Last 3 Pending Months */}
          {previousDues.length > 0 && (
            <>
              <hr className="my-6" />

              <h3 className="text-lg font-bold mb-4">
                Previous Pending Dues
              </h3>

              <div className="space-y-3">

                {previousDues.map((due) => (
                  <div
                    key={`${due.year}-${due.month}`}
                    className="flex justify-between items-center bg-red-50 border border-red-100 rounded-xl p-3"
                  >

                    <span className="font-medium">
                      {new Date(
                        due.year,
                        due.month - 1
                      ).toLocaleString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>

                    <span className="font-bold text-red-600">
                      ₹{due.amount}
                    </span>

                  </div>
                ))}

              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;