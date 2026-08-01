import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function Settings({
  selectedDate,
}) {
  const [mealPrice, setMealPrice] = useState("");
  const [advance, setAdvance] = useState("");

  useEffect(() => {
  loadSettings();
}, [selectedDate]);

  async function loadSettings() {
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const { data, error } = await supabase
    .from("monthly_settings")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    setMealPrice(data.meal_price);
    setAdvance(data.monthly_advance);
  } else {
    setMealPrice("");
    setAdvance("");
  }
}

  async function saveMealPrice() {
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const { error } = await supabase
    .from("monthly_settings")
    .upsert(
      {
        month,
        year,
        meal_price: Number(mealPrice),
        monthly_advance: Number(advance || 0),
      },
      {
        onConflict: "month,year",
      }
    );

  if (error) {
    alert(error.message);
  } else {
    alert("Saved Successfully");
  }
}

  async function saveAdvance() {
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();

  const { error } = await supabase
    .from("monthly_settings")
    .upsert(
      {
        month,
        year,
        meal_price: Number(mealPrice || 0),
        monthly_advance: Number(advance),
      },
      {
        onConflict: "month,year",
      }
    );

  if (error) {
    alert(error.message);
  } else {
    alert("Monthly Advance Saved");
  }
}

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-lg font-semibold text-green-600 mt-2">
  {selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })}
</p>
        <p className="text-gray-500">
          Manage your MealMate settings.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Meal Price
        </h2>

        <input
          type="number"
          value={mealPrice}
          onChange={(e) => setMealPrice(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={saveMealPrice}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Save Meal Price
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Monthly Advance
        </h2>

        <input
          type="number"
          value={advance}
          onChange={(e) => setAdvance(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={saveAdvance}
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Monthly Advance
        </button>

      </div>

    </div>
  );
}

export default Settings;