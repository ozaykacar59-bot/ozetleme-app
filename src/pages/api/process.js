import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST" });
  }

  const { text, type } = req.body;

  let prompt = "";
  if (type === "summary") {
    prompt = "Aşağıdaki metni kısa ve net özetle:\n\n" + text;
  }
  if (type === "translate") {
    prompt = "Aşağıdaki metni İngilizceye çevir:\n\n" + text;
  }
  if (type === "fix") {
    prompt =
      "Aşağıdaki metindeki yazım ve noktalama hatalarını düzelt, anlamı değiştirme:\n\n" +
      text;
  }

  try {
    const out = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: out.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: "AI error" });
  }
}
