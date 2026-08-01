import { useState } from "react";
import MealModal from "../../components/Calendar/MealModal";
function Calendar({ mealData, setMealData }) {
  const [selectedDay, setSelectedDay] = useState(null);
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Meal Calendar
        </h1>

        <p className="text-gray-500">
          Click any day to update your meal.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            August 2026
          </h2>

          <div className="flex gap-2">

            <button className="px-4 py-2 bg-gray-200 rounded-lg">
              ◀
            </button>

            <button className="px-4 py-2 bg-gray-200 rounded-lg">
              ▶
            </button>

          </div>

        </div>

        <div className="grid grid-cols-7 gap-4">

          {[
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
          ].map((day) => (
            <div
              key={day}
              className="font-bold text-center"
            >
              {day}
            </div>
          ))}

          {days.map((day) => (
  <div
    key={day}
    onClick={() => setSelectedDay(day)}
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

      {mealData[day] && (
        <div className="mt-2 text-2xl">
          {mealData[day].split(" ")[0]}
        </div>
      )}

    </div>
  </div>
))}

        </div>

      </div>
      {selectedDay && (
  <MealModal
    selectedDay={selectedDay}
    currentStatus={mealData[selectedDay]}
    onClose={() => setSelectedDay(null)}
    onSave={(status) => {
      setMealData({
        ...mealData,
        [selectedDay]: status,
      });

      setSelectedDay(null);
    }}
    onDelete={() => {
      const updatedData = { ...mealData };

      delete updatedData[selectedDay];

      setMealData(updatedData);

      setSelectedDay(null);
    }}
  />
)}
          
        
      

    </div>
  );
}

export default Calendar;