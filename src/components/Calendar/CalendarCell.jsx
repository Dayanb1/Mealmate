function CalendarCell({
  day,
  status,
  onClick,
}) {

  function getStatusColor() {
    // No status → normal white
    if (!status) {
      return "bg-white border-gray-300 hover:bg-gray-100";
    }

    // Ate Meal → light premium green
    if (status === "🍛 Ate Meal") {
      return "bg-green-100 border-green-400 hover:bg-green-200";
    }

    // Everything else → light premium red
    return "bg-red-100 border-red-400 hover:bg-red-200";
  }

  return (
    <div
      onClick={onClick}
      className={`
        h-24
        border
        rounded-xl
        flex
        items-center
        justify-center
        cursor-pointer
        transition
        ${getStatusColor()}
      `}
    >
      <div className="text-center">

        <div className="text-xl font-semibold">
          {day}
        </div>

        {status && (
          <div className="mt-2 text-2xl">
            {status.split(" ")[0]}
          </div>
        )}

      </div>
    </div>
  );
}

export default CalendarCell;