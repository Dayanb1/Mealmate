function MonthNavigation({
  currentDate,
  setCurrentDate,
}) {
  function previousMonth() {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  }

  return (
    <div className="flex justify-between items-center mb-6">

      <h2 className="text-2xl font-bold">
        {currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>

      <div className="flex gap-2">

        <button
          onClick={previousMonth}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          ◀
        </button>

        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          ▶
        </button>

      </div>

    </div>
  );
}

export default MonthNavigation;