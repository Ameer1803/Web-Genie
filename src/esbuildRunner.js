// esbuildRunner.js
import * as esbuild from 'esbuild-wasm';

let initialized = false;

export async function initializeEsbuild() {
    if (window.__esbuildInitialized) return;
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.25.4/esbuild.wasm',
      worker: true,
    });
    window.__esbuildInitialized = true;
    console.log("a");
}

export async function compileJSX(code, filename = 'App.jsx') {
  const virtualFiles = {
    [filename]: code,
  };

  const result = await esbuild.build({
    entryPoints: [filename],
    bundle: true,
    write: false,
    format: 'esm',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: { '.jsx': 'jsx' },
    external: ['react','react-dom'],
    plugins: [
      {
        name: 'virtual-fs',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
                    // Only intercept the entry file (virtual file)
            if (args.path === filename) {
            return { path: args.path, namespace: 'virtual' };
            }
            // Let esbuild handle other imports (like 'react')
            return;
          });

          build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
            const contents = virtualFiles[args.path];
            if (!contents) throw new Error(`File not found: ${args.path}`);
            return { contents, loader: 'jsx' };
          });
        },
      },
    ],
  });

  return result.outputFiles[0].text;
}
