import { useEffect, useState } from "react";

function MealModal({
  selectedDay,
  currentStatus,
  onSave,
  onDelete,
  onClose,
}) {
  const reasons = [
    "🍛 Ate Meal",
    "🌙 Night Shift",
    "🤒 Sick",
    "🏠 Home Town",
    "👥 Friend Room",
    "➕ Other",
  ];

  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    setSelectedStatus(currentStatus || "");
  }, [currentStatus]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">

        <h2 className="text-2xl font-bold">
          Day {selectedDay}
        </h2>

        <p className="text-gray-500 mt-2">
          Select today's status
        </p>

        <div className="mt-6 space-y-3">

          {reasons.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedStatus(item)}
              className={`w-full border rounded-xl p-3 text-left transition ${
                selectedStatus === item
                  ? "bg-green-200 border-green-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}

        </div>

        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white rounded-xl py-3"
          >
            Cancel
          </button>

          {currentStatus && (
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 text-white rounded-xl py-3"
            >
              Delete
            </button>
          )}

          <button
            onClick={() => {
              if (selectedStatus) {
                onSave(selectedStatus);
              }
            }}
            className="flex-1 bg-green-600 text-white rounded-xl py-3"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
}

export default MealModal;