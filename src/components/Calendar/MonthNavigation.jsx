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
    <div className="flex flex-col items-start gap-4">

      {/* Selected Month */}
      <div className="premium-card rounded-2xl px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">
          Selected Month
        </p>

        <h2 className="mt-1 text-2xl font-black text-slate-900">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>

      {/* Navigation Buttons BELOW month */}
      <div className="flex gap-3">

        <button
          onClick={previousMonth}
          className="premium-month-button flex h-11 w-14 items-center justify-center rounded-2xl text-xl font-bold text-slate-700"
          aria-label="Previous month"
        >
          ◀
        </button>

        <button
          onClick={nextMonth}
          className="premium-month-button flex h-11 w-14 items-center justify-center rounded-2xl text-xl font-bold text-slate-700"
          aria-label="Next month"
        >
          ▶
        </button>

      </div>

    </div>
  );
}

export default MonthNavigation;