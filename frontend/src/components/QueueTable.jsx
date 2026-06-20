export default function QueueTable({ queue }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold text-slate-800">
          Queue List
        </h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
          {queue.length} Patients
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-100 text-slate-700">

              <th className="py-4 px-6 text-left rounded-l-xl">
                Token
              </th>

              <th className="py-4 px-6 text-left">
                Patient Name
              </th>

              <th className="py-4 px-6 text-left rounded-r-xl">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            {queue.map((patient) => (
              <tr
                key={patient.token}
                className="border-b hover:bg-slate-50 transition text-left"
              >
                <td className="py-5 px-6">

                  <span className="font-bold text-blue-600 text-lg">
                    #{patient.token}
                  </span>

                </td>

                <td className="font-semibold text-slate-700 py-5 px-6">
                  {patient.name}
                </td>

                <td className="py-5 px-6">

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                    ${patient.status === "waiting"
                        ? "bg-yellow-100 text-yellow-700"
                        : patient.status === "serving"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {patient.status}
                  </span>

                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {queue.length === 0 && (
        <div className="text-left px-6 py-10">

          <div className="text-5xl mb-3">
            🏥
          </div>

          <p className="text-gray-500">
            No patients in queue
          </p>

        </div>
      )}

    </div>
  );
}