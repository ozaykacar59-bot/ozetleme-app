import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(type) {
    setLoading(true);
    setResult("");

    try {
      const r = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });

      const d = await r.json();
      if (d.error) setResult("❌ " + d.error);
      else setResult(d.result);
    } catch {
      setResult("❌ Sunucu hatası");
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Metin Özetleme & Çeviri</h1>

        <textarea
          style={styles.textarea}
          placeholder="Metni buraya yapıştır…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div style={styles.buttons}>
          <button onClick={() => run("summary")}>Özetle</button>
          <button onClick={() => run("translate")}>Çevir</button>
          <button onClick={() => run("fix")}>Yazım Düzelt</button>
        </div>

        <div style={styles.output}>
          {loading ? "⏳ İşleniyor..." : result || "Çıktı burada görünecek"}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#141e30,#243b55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: 720,
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 20px 40px rgba(0,0,0,.3)",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  textarea: {
    width: "100%",
    height: 150,
    padding: 12,
    fontSize: 14,
    borderRadius: 8,
    border: "1px solid #ccc",
    resize: "vertical",
  },
  buttons: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  output: {
    marginTop: 16,
    minHeight: 120,
    padding: 12,
    borderRadius: 8,
    background: "#f4f6f8",
    whiteSpace: "pre-wrap",
  },
};
