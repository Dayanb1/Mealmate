import CalendarGrid from "../../components/Calendar/CalendarGrid";
import MonthNavigation from "../../components/Calendar/MonthNavigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import MealModal from "../../components/Calendar/MealModal";

function Calendar({
  mealData,
  setMealData,
  selectedDate,
  setSelectedDate,
  loadMeals,
}) {
  const [selectedDay, setSelectedDay] = useState(null);
  



  

  function getMealDate(day) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
  const daysInMonth = new Date(
  selectedDate.getFullYear(),
  selectedDate.getMonth() + 1,
  0
).getDate();

const days = Array.from(
  { length: daysInMonth },
  (_, i) => i + 1
);
  

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

        <MonthNavigation
  currentDate={selectedDate}
  setCurrentDate={setSelectedDate}
/>

        <CalendarGrid
  currentDate={selectedDate}
  mealData={mealData}
  setSelectedDay={setSelectedDay}
/>

      </div>

      {selectedDay && (
        <MealModal
          selectedDay={selectedDay}
          currentStatus={mealData[selectedDay]}
          onClose={() => setSelectedDay(null)}

          onSave={async (status) => {

            const { error } = await supabase
              .from("meals_v2")
              .upsert(
  {
    meal_date: getMealDate(selectedDay),
    status: status,
  },
  {
    onConflict: "meal_date",
  }
);

            if (error) {
              console.error(error);
              alert(error.message);
              return;
            }

            await loadMeals();

            setSelectedDay(null);
          }}

          onDelete={async () => {

            const { error } = await supabase
              .from("meals_v2")
              .delete()
              .eq("meal_date", getMealDate(selectedDay));

            if (error) {
              console.error(error);
              alert(error.message);
              return;
            }

            await loadMeals();

            setSelectedDay(null);
          }}

        />
      )}

    </div>
  );
}

export default Calendar;