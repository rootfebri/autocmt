// build.js
const { build } = require('esbuild');

build({
    entryPoints: ['src/main.ts'], // Entry point of your CLI
    bundle: true,
    platform: 'node', // Target platform is Node.js
    target: 'node16', // Target Node.js version
    outfile: 'dist/my-cli-app.js', // Output file
    minify: true, // Optional: Minify the output for smaller size
    external: ['bun'], // Exclude 'bun' or any other native dependencies
    format: 'cjs', // CommonJS format for Node.js compatibility
}).catch(() => process.exit(1));
