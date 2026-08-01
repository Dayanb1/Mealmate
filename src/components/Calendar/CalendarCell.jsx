function CalendarCell({
  day,
  status,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
        h-24
        border
        rounded-xl
        flex
        items-center
        justify-center
        cursor-pointer
        hover:bg-green-100
        transition
      "
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