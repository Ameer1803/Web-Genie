import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";

export async function main(prompt) {

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
      { role: "system", content: "You are a react webpage coder. Generate fully functional components with export default based on what the user provides to you so it can run inside esbuild-wasm. background is black. Make sure that you use const {useState} = React instead of importing react. It should be valid jsx code without any errors and use tailwind css. OUTPUT SHOULD BE ONLY CODE inside a json with one key named code, and the code string must be valid JSON (use JSON.stringify to escape all newlines and quotes)). Do NOT include any Markdown formatting (no triple backticks, no language tags). Output ONLY valid JSON.." },
      { role: "user", content: prompt }
    ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }
    let content = response.body.choices[0].message.content.trim();
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

