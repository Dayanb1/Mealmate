import CalendarCell from "./CalendarCell";

function CalendarGrid({
  currentDate,
  mealData,
  setSelectedDay,
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const cells = [];

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div key={`empty-${i}`}></div>
    );
  }

  // Actual days
  for (let day = 1; day <= totalDays; day++) {
    cells.push(
      <CalendarCell
        key={day}
        day={day}
        status={mealData[day]}
        onClick={() => setSelectedDay(day)}
      />
    );
  }

  return (
    <>

      <div className="grid grid-cols-7 gap-4 mb-4">

        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((item) => (
          <div
            key={item}
            className="text-center font-bold"
          >
            {item}
          </div>
        ))}

      </div>

      <div className="grid grid-cols-7 gap-4">
        {cells}
      </div>

    </>
  );
}

export default CalendarGrid;