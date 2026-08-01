function DashboardCard({ title, value, color }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-6
        hover:shadow-xl
        transition
        duration-300
      "
    >
      <p className="text-gray-500 text-lg">{title}</p>

      <h2
        className="text-4xl font-bold mt-3"
        style={{ color }}
      >
        {value}
      </h2>
    </div>
  );
}

export default DashboardCard;