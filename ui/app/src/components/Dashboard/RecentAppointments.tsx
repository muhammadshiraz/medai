export default function RecentAppointments() {
  const appointments = [
    {
      id: 1,
      patient: "John Doe",
      doctor: "Dr. Smith",
      time: "09:00 AM",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Jane Smith",
      doctor: "Dr. Wilson",
      time: "10:30 AM",
      status: "Pending",
    },
    {
      id: 3,
      patient: "Mike Johnson",
      doctor: "Dr. Brown",
      time: "02:15 PM",
      status: "In Progress",
    },
    {
      id: 4,
      patient: "Sarah Williams",
      doctor: "Dr. Taylor",
      time: "04:45 PM",
      status: "Scheduled",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Patient</th>
              <th className="pb-3">Doctor</th>
              <th className="pb-3">Time</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b last:border-0">
                <td className="py-3">{appointment.patient}</td>
                <td className="py-3">{appointment.doctor}</td>
                <td className="py-3">{appointment.time}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      appointment.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800 dark:text-white"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
