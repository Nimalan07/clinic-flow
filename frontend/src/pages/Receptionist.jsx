import { useState, useEffect } from "react";


import socket from "../services/socket";

import QueueTable from "../components/QueueTable";
import QueueStats from "../components/QueueStats";
import QRCodeCard from "../components/QRCodeCard";

export default function Receptionist() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [queueData, setQueueData] = useState({
    queue: [],
    currentToken: null,
    averageConsultationTime: null,
  });

  useEffect(() => {
    socket.on("queueUpdated", (data) => {
      setQueueData(data);
    });

    socket.on("errorMessage", (message) => {
      alert(message);
    });

    // Request current queue status immediately when mounting
    socket.emit("requestQueue");

    return () => {
      socket.off("queueUpdated");
      socket.off("errorMessage");
    };
  }, []);

  const addPatient = () => {
    if (!name.trim()) return;

    socket.emit("addPatient", name);
    setName("");
  };

  const callNext = () => {
    setLoading(true);

    socket.emit("callNext");

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  const resetQueue = () => {
    const confirmReset =
      window.confirm(
        "Clear entire queue?"
      );

    if (!confirmReset) return;

    socket.emit("resetQueue");
    setShowReset(true);

    setTimeout(() => {
      setShowReset(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Top Header */}

      <div className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">


          <div className="flex gap-3">

            <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full font-medium">
              🟢 Live
            </div>



          </div>

        </div>
      </div>

      <div className="w-full px-8 md:px-12 py-6 text-left">

        {/* Hero Card */}



        {showReset && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl font-semibold text-left shadow">
            🧹 Queue Cleared Successfully
          </div>
        )}

        <QueueStats
          queue={queueData.queue}
          currentToken={queueData.currentToken}
          averageConsultationTime={
            queueData.averageConsultationTime
          }
        />

        {/* Horizontal side-by-side display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          {/* Main Controls & Queue List (Left Side) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Reception Desk */}
            <div className="bg-white rounded-3xl shadow-lg p-6">

              <div className="mb-5">

                <h3 className="text-2xl font-bold text-slate-800">
                  Reception Desk
                </h3>

                <p className="text-slate-500">
                  Register patients and manage appointments
                </p>

              </div>

              <div className="flex flex-col md:flex-row gap-3">

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addPatient();
                    }
                  }}
                  placeholder="Enter Patient Name"
                  className="
                    flex-1
                    border-2
                    border-slate-200
                    p-3
                    rounded-xl
                    focus:outline-none
                    focus:border-blue-500
                  "
                />

                <button
                  onClick={addPatient}
                  className="
                    bg-green-600
                    hover:bg-green-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                  "
                >
                  ➕ Add Patient
                </button>

                <button
                  disabled={loading}
                  onClick={callNext}
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    disabled:bg-gray-400
                  "
                >
                  📢 Call Next
                </button>
                <button
                  onClick={resetQueue}
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                  "
                >
                  🧹 Reset Queue
                </button>
              </div>

            </div>

            {/* Queue Table */}
            <QueueTable
              queue={queueData.queue}
            />

          </div>

          {/* Side Panel: QR Code (Right Side) */}
          <div className="h-full">
            <QRCodeCard />
          </div>

        </div>



      </div>

    </div>
  );
}