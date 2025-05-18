import OpenAI from "openai";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o-mini";

export async function main(prompt) {
  const client = new OpenAI({ baseURL: endpoint, apiKey: token });

  const response = await client.chat.completions.create({
    messages: [
      { role: "system", content: "You are a react webpage coder. Generate fully functional components with export default based on what the user provides to you so it can run inside esbuild-wasm. Make sure that you use const {useState} = React instead of importing react. It should be valid jsx code without any errors and use tailwind css. OUTPUT SHOULD BE ONLY CODE inside a json with one key named code, and the code string must be valid JSON (use JSON.stringify to escape all newlines and quotes)). Do NOT include any Markdown formatting (no triple backticks, no language tags). Output ONLY valid JSON.." },
      { role: "user", content: prompt }
    ],
    temperature: 1.0,
    top_p: 1.0,
    max_tokens: 1000,
    model: modelName
  });

  // Check for errors in the response
  if (!response || !response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
    throw new Error("No content returned from LLM");
  }

  let content = response.choices[0].message.content.trim();
  // Remove Markdown code block if present
  if (content.startsWith('```')) {
    content = content.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '');
  }
  console.log(content);
  const parsed = JSON.parse(content);
  return parsed;
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});