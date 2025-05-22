import React, { useEffect, useState } from 'react';
import { initializeEsbuild, compileJSX } from './esbuildRunner';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx'; // or 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-okaidia.css';
import './App.css'
import Load from './Load'

export default function App() {
  const [devMode, setDevMode] = useState(false);
  const [code, setCode] = useState(""); // Save this from API response
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

      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.code) {
        throw new Error("No code received from backend");
      }

      setCode(data.code);
      try {
      const output = await compileJSX(data.code);
      const blob = new Blob([output], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      window.React = React; // expose React globally for the compiled code
      const mod = await import(/* @vite-ignore */ url);
      setComponent(() => mod.default);
      } catch (e) {
        setError("JSX Compile Error: " + e.message);
      setDevMode(true); // Open editor for user to fix code
      setComponent(null);
    }
    } catch (e) {
      setError(e.message);
      console.error("Component generation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  if (Component && !loading) {
    console.log('beep');
    return (
      <>
      <button onClick={() => setDevMode(!devMode)} className="fixed top-4 right-4 z-50">
  +++ 
</button>
      <Component />;
      {devMode && (
  <div className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-40 p-4 overflow-y-auto transition-transform">
    <h2 className="text-lg font-bold mb-2">Edit Component Code</h2>
    <Editor
      value={code}
      onValueChange={setCode}
      highlight={code => Prism.highlight(code, Prism.languages.jsx, 'jsx')}
      padding={10}
      className="text-sm font-mono bg-gray-100 border rounded"
    />
    <button
      onClick={async () => {
        try {
          const output = await compileJSX(code);
          console.log('saved');
          const blob = new Blob([output], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);
          const mod = await import(/* @vite-ignore */ url);
          setComponent(() => mod.default);
          setDevMode(false);
        } catch (err) {
          setError(err.message);
        }
      }}
      className="mt-4 bg-green-500 text-white p-2 rounded border-0 border-b-4 border-green-700"
        >
      Save & Apply
        </button>
      </div>
    )}
    </>
    );
  }
  return (
    <div className="p-4">
      <div className="items-center justify-center min-h-200 gap-10">
        <div className='flex items-center gap-10'>
        {/* <img className = 'size-28' src="techbot.svg"></img> */}
        <svg viewBox="0 0 2150 400">
          <text class="svgText" x="10" y="550">WEB GENIE</text>
        </svg>
        </div>
    <button onClick={() => setDevMode(!devMode)} className="fixed top-4 right-4 z-50">
  +++ 
</button>

{loading &&  <Load />}

{devMode && (
  <div className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-40 p-4 overflow-y-auto transition-transform">
    <h2 className="text-lg font-bold mb-2">Edit Component Code</h2>
    <Editor
      value={code}
      onValueChange={setCode}
      highlight={code => Prism.highlight(code, Prism.languages.jsx, 'jsx')}
      padding={10}
      className="text-sm font-mono bg-gray-100 border rounded"
    />
    <button
      onClick={async () => {
        try {
          const output = await compileJSX(code);
          const blob = new Blob([output], { type: 'text/javascript' });
          const url = URL.createObjectURL(blob);
          const mod = await import(/* @vite-ignore */ url);
          setComponent(() => mod.default);
          setDevMode(false);
        } catch (err) {
          setError(err.message);
        }
      }}
      className="mt-4 bg-green-500 text-white p-2 rounded border-0 border-b-4 border-green-700"
        >
      Save & Apply
        </button>
      </div>
    )}
      <div className="my-4 text-white">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border-0 border-b-2 border-gray-400 p-2 rounded-none w-full bg-transparent text-white focus:outline-none focus:border-blue-400"
          placeholder="Describe the component you want..."
          onKeyDown={e => {
            if (e.key === "Enter" && !loading) handleGenerate(prompt);
          }}
          disabled={loading}
        />
        {/* <button
          onClick={() => handleGenerate(prompt)}
          className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Component"}
        </button> */}
        <div className='my-2 italic light text-sm content-normal flex'>
        <div className='flex-1 text-left'>Build your page with a prompt</div>
        <div className='flex-1 text-right'>Press ENTER to search</div>
        </div>
      </div>

      {/* {error && <p className="text-red-500">❌ {error}</p>} */}
      {!Component && !error && <p className="text-gray-600">No component loaded yet.</p>}
      {Component && (
        <div className="mt-6">
          <Component />
        </div>
      )}
    </div>
    </div>
  );
}
