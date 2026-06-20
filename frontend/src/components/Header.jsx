import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";
import socket from "../services/socket";

export default function Header() {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Sync initial state
    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <header className="bg-slate-950 border-b border-slate-800 shadow-xl">

      <div className="w-full px-8 md:px-12 py-4 flex flex-col lg:flex-row justify-between items-center gap-5">

        {/* Logo Section */}

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-lg">
            <img src={logoImg} alt="ClinicFlow Logo" className="w-full h-full object-contain" />
          </div>

          <div>

            <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              ClinicFlow
            </div>

            <p className="text-slate-400 text-sm md:text-base">
              Smart Clinic Queue Management System
            </p>

          </div>

        </div>

        {/* Right Section */}

        <div className="flex flex-wrap items-center justify-center gap-3">

          {/* Live Status */}

          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
            isConnected
              ? "bg-green-500/15 border-green-500/30 text-green-400"
              : "bg-red-500/15 border-red-500/30 text-red-400"
          }`}>

            <span className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}></span>

            <span className="font-medium">
              {isConnected ? "Live Sync Active" : "Disconnected"}
            </span>

          </div>

          {/* Reception */}

          <Link
            to="/"
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300
            ${
              location.pathname === "/"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            🏥 Reception Desk
          </Link>

          {/* Patient */}

          <Link
            to="/patient"
            className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300
            ${
              location.pathname === "/patient"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-slate-800 text-white hover:bg-slate-700"
            }`}
          >
            📺 Patient Display
          </Link>

        </div>

      </div>

    </header>
  );
}