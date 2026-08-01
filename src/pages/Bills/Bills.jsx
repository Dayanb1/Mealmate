function Bills({
  mealData,
  mealPrice,
  monthlyAdvance,
  selectedDate,
}) {
  const totalMeals = Object.values(mealData).filter(
    (item) => item === "🍛 Ate Meal"
  ).length;

  const mealCost = totalMeals * mealPrice;

  const balance = monthlyAdvance - mealCost;

  const generatedOn = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const monthName = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Monthly Bill
        </h1>

        <p className="text-gray-500">
          Complete bill summary for the selected month.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">

        <h2 className="text-2xl font-bold mb-6">
          {monthName}
        </h2>

        <div className="space-y-5">

          <div className="flex justify-between">
            <span>Meal Price</span>
            <span className="font-semibold">
              ₹{mealPrice}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Meals Eaten</span>
            <span className="font-semibold">
              {totalMeals}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Meal Cost</span>
            <span className="font-semibold">
              ₹{mealCost}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Monthly Advance</span>
            <span className="font-semibold">
              ₹{monthlyAdvance}
            </span>
          </div>

          <hr />

          {balance >= 0 ? (
            <div className="flex justify-between text-green-600 text-2xl font-bold">
              <span>Advance Left</span>
              <span>₹{balance}</span>
            </div>
          ) : (
            <div className="flex justify-between text-red-600 text-2xl font-bold">
              <span>Need To Pay</span>
              <span>₹{Math.abs(balance)}</span>
            </div>
          )}

          <hr />

          <div className="flex justify-between text-gray-500">
            <span>Generated On</span>
            <span>{generatedOn}</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Bills;