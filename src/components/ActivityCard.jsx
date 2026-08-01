function ActivityCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-bold mb-5">
        Recent Activity
      </h2>

      <ul className="space-y-3">

        <li>🍛 Meal marked for Today</li>

        <li>🏠 Home Town - 25 July</li>

        <li>🌙 Night Shift - 18 July</li>

      </ul>

    </div>
  );
}

export default ActivityCard;