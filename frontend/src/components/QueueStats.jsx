export default function QueueStats({
  queue,
  currentToken,
  averageConsultationTime,
}) {
  const waiting = queue.filter(
    (p) => p.status === "waiting"
  ).length;

  const completed = queue.filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 text-left">

      <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg">
        <p>Current Token</p>
        <h2 className="text-4xl font-bold mt-2">
          {currentToken || "-"}
        </h2>
      </div>

      <div className="bg-amber-500 text-white rounded-2xl p-6 shadow-lg">
        <p>Waiting</p>
        <h2 className="text-4xl font-bold mt-2">
          {waiting}
        </h2>
      </div>

      <div className="bg-green-600 text-white rounded-2xl p-6 shadow-lg">
        <p>Completed</p>
        <h2 className="text-4xl font-bold mt-2">
          {completed}
        </h2>
      </div>

      <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg">
        <p>Avg Consultation</p>
        <h2 className="text-4xl font-bold mt-2">
          {averageConsultationTime ? `${averageConsultationTime}m` : "-"}
        </h2>
      </div>

    </div>
  );
}