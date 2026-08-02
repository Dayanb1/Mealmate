import DashboardCard from "../../components/DashboardCard.jsx";
import StatusCard from "../../components/StatusCard.jsx";
import ActivityCard from "../../components/ActivityCard.jsx";

function Dashboard({
  mealData,
  mealPrice,
  monthlyAdvance,
}) {
    const totalMeals = Object.values(mealData).filter(
  (status) => status === "🍛 Ate Meal"
).length;



const currentBill = totalMeals * mealPrice;

const selectedDate = new Date();

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

const balanceColor =
  remainingBalance >= 0 ? "#16a34a" : "#dc2626";

const balanceTitle =
  remainingBalance >= 0
    ? "Advance Left"
    : "Need To Pay";


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's your meal summary.
        </p>
      </div>

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
        <StatusCard />
        <ActivityCard />
      </div>
    </div>
  );
}

export default Dashboard;