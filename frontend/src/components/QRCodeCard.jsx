import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeCard() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 text-left">

      <h2 className="text-3xl font-bold mb-3">
        Patient Access
      </h2>

      <p className="text-slate-500 mb-5">
        Scan to view the live queue
      </p>

      <div className="flex justify-start">
        <QRCodeCanvas
          value={`${window.location.origin}/patient`}
          size={220}
        />
      </div>

    </div>
  );
}