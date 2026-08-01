function Reports({
  mealData,
  mealPrice,
  monthlyAdvance,
  selectedDate,
}) {
  const values = Object.values(mealData);

  const totalMeals = values.filter(
    (item) => item === "🍛 Ate Meal"
  ).length;

  const nightShift = values.filter(
    (item) => item === "🌙 Night Shift"
  ).length;

  const sick = values.filter(
    (item) => item === "🤒 Sick"
  ).length;

  const homeTown = values.filter(
    (item) => item === "🏠 Home Town"
  ).length;

  const friendRoom = values.filter(
    (item) => item === "👥 Friend Room"
  ).length;

  const other = values.filter(
    (item) => item === "➕ Other"
  ).length;

  const totalRecorded = values.length;

  const totalDays = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  const pendingDays = totalDays - totalRecorded;

  const attendance = (
    (totalMeals / totalDays) *
    100
  ).toFixed(1);

  const mealCost = totalMeals * mealPrice;

  const balance = monthlyAdvance - mealCost;

  const monthName = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Reports
        </h1>

        <p className="text-gray-500">
          Monthly analytics report
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          {monthName}
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between">
            <span>🍛 Ate Meal</span>
            <span>{totalMeals}</span>
          </div>

          <div className="flex justify-between">
            <span>🌙 Night Shift</span>
            <span>{nightShift}</span>
          </div>

          <div className="flex justify-between">
            <span>🤒 Sick</span>
            <span>{sick}</span>
          </div>

          <div className="flex justify-between">
            <span>🏠 Home Town</span>
            <span>{homeTown}</span>
          </div>

          <div className="flex justify-between">
            <span>👥 Friend Room</span>
            <span>{friendRoom}</span>
          </div>

          <div className="flex justify-between">
            <span>➕ Other</span>
            <span>{other}</span>
          </div>

          <hr />

          <div className="flex justify-between">
            <span>Recorded Days</span>
            <span>{totalRecorded}</span>
          </div>

          <div className="flex justify-between">
            <span>Pending Days</span>
            <span>{pendingDays}</span>
          </div>

          <div className="flex justify-between">
            <span>Meal Attendance</span>
            <span>{attendance}%</span>
          </div>

          <hr />

          <div className="flex justify-between">
            <span>Meal Cost</span>
            <span>₹{mealCost}</span>
          </div>

          <div className="flex justify-between">
            <span>Advance</span>
            <span>₹{monthlyAdvance}</span>
          </div>

          <div
            className={`flex justify-between font-bold text-lg ${
              balance >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <span>
              {balance >= 0
                ? "Advance Left"
                : "Need To Pay"}
            </span>

            <span>
              ₹{Math.abs(balance)}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;