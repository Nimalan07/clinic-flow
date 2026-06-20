import { Link, useLocation } from "react-router-dom";
import logoImg from "../assets/logo.png";

export default function Header() {
  const location = useLocation();

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

          <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/30 text-green-400 px-4 py-2 rounded-full">

            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>

            <span className="font-medium">
              Live Sync Active
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