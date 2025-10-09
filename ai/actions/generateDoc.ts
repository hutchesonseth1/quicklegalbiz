import OpenAI from "openai";
import { logEvent } from "../memory/logEvent";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateDoc({ topic, userData }: any) {
  const prompt = \`
    Create a simple legal-style document template for \${topic}.
    Use this user data: \${JSON.stringify(userData)}
    Keep it clear, professional, and ready to export.
  \`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a legal document AI assistant." },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0].message?.content ?? "No output.";
  await logEvent(\`Document generated for topic: \${topic}\`);
  return content;
}
