import React, { useEffect, useState } from 'react';
import { initializeEsbuild, compileJSX } from './esbuildRunner';

export default function App() {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeEsbuild().catch((err) => {
      console.error("Failed to initialize esbuild:", err);
      setError("esbuild initialization failed");
    });
  }, []);

  const handleGenerate = async (prompt) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:3001/generate-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.code) {
        throw new Error("No code received from backend");
      }

      const output = await compileJSX(data.code);
      const blob = new Blob([output], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      window.React = React; // expose React globally for the compiled code
      const mod = await import(/* @vite-ignore */ url);
      setComponent(() => mod.default);
    } catch (e) {
      setError(e.message);
      console.error("Component generation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-center min-h-60">
        <h1 className="text-2xl font-bold mb-4">Web Genie</h1>
      </div>

      <div className="my-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Describe the component you want..."
        />
        <button
          onClick={() => handleGenerate(prompt)}
          className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Component"}
        </button>
      </div>

      {/* {error && <p className="text-red-500">❌ {error}</p>} */}
      {!Component && !error && <p className="text-gray-600">No component loaded yet.</p>}
      {Component && (
        <div className="mt-6">
          <Component />
        </div>
      )}
    </div>
  );
}
