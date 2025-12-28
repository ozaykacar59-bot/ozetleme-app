"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const ozetle = () => {
    setResult("Özetleniyor...");
  };

  const cevir = () => {
    setResult("Çevriliyor...");
  };

  const duzelt = () => {
    setResult("Düzeltiliyor...");
  };

  return (
    <main className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Metin Özetleme & Çeviri
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Metni buraya yapıştır"
        className="w-full h-48 p-3 border rounded mb-4"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={ozetle}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Özetle
        </button>

        <button
          onClick={cevir}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Çevir
        </button>

        <button
          onClick={duzelt}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Yazım Düzelt
        </button>
      </div>

      <div className="border p-3 rounded bg-gray-50 min-h-[100px]">
        {result || "Çıktı burada görünecek"}
      </div>
    </main>
  );
}
