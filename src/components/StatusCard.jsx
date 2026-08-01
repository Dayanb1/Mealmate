function StatusCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-bold">
        Today's Status
      </h2>

      <p className="text-red-600 font-semibold mt-4">
        🔴 Pending
      </p>

      <div className="flex gap-4 mt-6">

        <button
          className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          🍛 Ate Meal
        </button>

        <button
          className="
          bg-red-600
          hover:bg-red-700
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          ❌ Didn't Eat
        </button>

      </div>

    </div>
  );
}

export default StatusCard;