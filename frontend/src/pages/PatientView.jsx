import { useEffect, useState, useRef } from "react";
import socket from "../services/socket";
const playSound = () => {
  const audio = new Audio("/ding.mp3");
  audio.play().catch((err) => {
    console.warn("Audio playback failed or was blocked by the browser. Please interact with the page first.", err);
  });
};
export default function PatientView() {
  const [queueData, setQueueData] = useState({
    queue: [],
    currentToken: null,
    averageConsultationTime: null,
  });

  const [lastUpdated, setLastUpdated] = useState("");

  const [highlightToken, setHighlightToken] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [tokensAhead, setTokensAhead] = useState(null);

  const isInitial = useRef(true);

  useEffect(() => {
    const handleUnlock = () => {
      const audio = new Audio("/ding.mp3");
      audio.muted = true;
      audio.play()
        .then(() => {
          window.removeEventListener("click", handleUnlock);
        })
        .catch((e) => console.log("Audio unlock failed:", e));
    };
    window.addEventListener("click", handleUnlock);
    return () => window.removeEventListener("click", handleUnlock);
  }, []);

  useEffect(() => {
    socket.on("queueUpdated", (data) => {
      setQueueData((prev) => {
        // Prevent sound from playing on the initial data fetch when mounting the component
        if (isInitial.current) {
          isInitial.current = false;
          return data;
        }

        if (
          data.currentToken &&
          data.currentToken !== prev.currentToken
        ) {
          // Play sound and trigger highlight outside state reducer flow
          setTimeout(() => {
            playSound();
            setHighlightToken(data.currentToken);
            setTimeout(() => {
              setHighlightToken(null);
            }, 5000);
          }, 0);
        }
        return data;
      });

      setLastUpdated(
        new Date().toLocaleTimeString()
      );
    });

    // Request current queue status immediately when mounting
    socket.emit("requestQueue");

    return () => {
      socket.off("queueUpdated");
    };
  }, []);

  const waiting = queueData.queue.filter(
    (p) => p.status === "waiting"
  ).length;

  const waitTime = waiting === 0 ? 0 : (queueData.averageConsultationTime ? waiting * queueData.averageConsultationTime : null);

  const calculatePosition = () => {
    const token = Number(tokenInput);

    const patient =
      queueData.queue.find(
        (p) => p.token === token
      );

    if (!patient) {
      setTokensAhead("Not Found");
      return;
    }

    const ahead =
      queueData.queue.filter(
        (p) =>
          (p.status === "waiting" ||
            p.status === "serving") &&
          p.token < token
      ).length;

    setTokensAhead(ahead);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 md:p-12 flex flex-col justify-start">

      <div className="w-full max-w-full bg-slate-900/50 border border-slate-850 rounded-3xl shadow-2xl p-10 flex-1">


        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-5 py-2 rounded-full font-semibold text-sm">
            Real-Time Queue Updates
          </span>
        </div>

        {highlightToken && (
          <div className="mb-6 bg-yellow-400 text-black rounded-2xl p-6 text-left animate-bounce shadow-2xl">

            <h2 className="text-xl font-bold">
              🔔 NOW CALLING
            </h2>

            <p className="text-8xl font-extrabold mt-3">
              #{highlightToken}
            </p>

          </div>
        )}

        {/* Stats Grid: Left to Right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
          {/* Current Token */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold text-xs border border-green-500/30">
                NOW SERVING
              </span>
              <p className="text-slate-400 text-sm mt-3">
                Current Token
              </p>
            </div>
            <p className="text-7xl font-extrabold text-green-400 leading-none">
              {queueData.currentToken || "-"}
            </p>
          </div>

          {/* Waiting */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left flex flex-col justify-between min-h-[160px]">
            <p className="text-slate-400 text-sm">
              Patients Waiting
            </p>
            <p className="text-7xl font-bold text-white leading-none">
              {waiting}
            </p>
          </div>

          {/* Wait Time */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-left flex flex-col justify-between min-h-[160px]">
            <p className="text-slate-400 text-sm">
              Estimated Wait
            </p>
            <p className="text-7xl font-bold text-cyan-400 leading-none">
              {waitTime !== null ? (
                <>
                  {waitTime} <span className="text-xl font-semibold text-slate-400">mins</span>
                </>
              ) : (
                "-"
              )}
            </p>
          </div>
        </div>

        <hr className="border-slate-800 mb-8" />

        {/* Token Lookup */}

        <h3 className="text-2xl font-bold text-left text-white mb-5">
          Check Your Position
        </h3>

        <div className="flex gap-3 max-w-xl">

          <input
            type="number"
            placeholder="Enter Token Number"
            value={tokenInput}
            onChange={(e) =>
              setTokenInput(
                e.target.value
              )
            }
            className="
              flex-1
              bg-slate-800
              border
              border-slate-700
              text-white
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:border-blue-500
            "
          />

          <button
            onClick={calculatePosition}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              rounded-xl
              font-semibold
              transition-colors
            "
          >
            Check
          </button>

        </div>

        {tokensAhead !== null && (
          <div className="mt-5 max-w-xl">

            {tokensAhead === "Not Found" ? (
              <div className="bg-red-500/20 text-red-400 border border-red-500/30 p-4 rounded-xl">
                Token not found
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-left">

                <p className="text-white text-lg">
                  Tokens Ahead:
                  {" "}
                  <span className="font-bold text-yellow-400">
                    {tokensAhead}
                  </span>
                </p>

                <p className="text-white text-lg mt-2">
                  Estimated Wait:
                  {" "}
                  <span className="font-bold text-cyan-400">
                    {queueData.averageConsultationTime ? (
                      `${tokensAhead * queueData.averageConsultationTime} mins`
                    ) : (
                      "-"
                    )}
                  </span>
                </p>

              </div>
            )}

          </div>
        )}

        <div className="mt-8 text-left text-slate-500 text-sm">
          Last Updated: {lastUpdated}
        </div>

      </div>

    </div>
  );
}