import DashboardCard from "../../components/DashboardCard.jsx";
import StatusCard from "../../components/StatusCard.jsx";
import ActivityCard from "../../components/ActivityCard.jsx";

function Dashboard({ mealData }) {
    const totalMeals = Object.values(mealData).filter(
  (status) => status === "🍛 Ate Meal"
).length;

const mealPrice = 80;

const currentBill = totalMeals * mealPrice;

const pendingDays = 31 - Object.keys(mealData).length;

const advance = 1000;
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back! Here's your meal summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          value="₹1000"
          color="#ea580c"
        />

        <DashboardCard
          title="Pending Days"
          value={pendingDays}
          color="#dc2626"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StatusCard />
        <ActivityCard />
      </div>
    </div>
  );
}

export default Dashboard;