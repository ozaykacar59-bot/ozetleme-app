// Basit günlük IP limiter (ücretsiz: 2)
const usageMap = global.__usageMap || new Map();
global.__usageMap = usageMap;

function getIP(req) {
  return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function checkLimit(req) {
  const ip = getIP(req);
  const day = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${day}`;

  const data = usageMap.get(key) || { count: 0 };
  if (data.count >= 2) return false;

  data.count++;
  usageMap.set(key, data);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  if (!checkLimit(req)) {
    return res.status(429).json({
      error: "Günlük ücretsiz limit doldu. Yarın tekrar dene.",
    });
  }

  const { text, type } = req.body;

  if (!text || text.trim().length < 3) {
    return res.status(400).json({ error: "Metin çok kısa" });
  }

  let instruction = "";
  if (type === "summary") instruction = "Metni kısa ve net özetle.";
  if (type === "translate") instruction = "Metni İngilizceye çevir.";
  if (type === "fix")
    instruction = "Yazım ve noktalama hatalarını düzelt, anlamı değiştirme.";

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: instruction },
          { role: "user", content: text },
        ],
        max_tokens: 500,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: data.error?.message || "OpenAI hatası",
      });
    }

    res.json({
      result: data.choices[0].message.content,
    });
  } catch (e) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
}
