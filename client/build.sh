#!/bin/bash

# Simple build script for Vercel deployment
echo "Starting Vercel build process..."
echo "Current directory: $(pwd)"
echo "Listing source directory:"
ls -la ./src/

# Copy Vercel-specific files
echo "Copying Vercel-specific files..."
if [ -f "./src/main.vercel.tsx" ]; then
    cp ./src/main.vercel.tsx ./src/main.tsx
    echo "main.vercel.tsx copied to main.tsx"
else
    echo "WARNING: ./src/main.vercel.tsx not found"
    ls -la ./src/main*
fi

if [ -f "./src/index.vercel.css" ]; then
    cp ./src/index.vercel.css ./src/index.css
    echo "index.vercel.css copied to index.css"
else
    echo "WARNING: ./src/index.vercel.css not found"
    ls -la ./src/index*
fi

# Check config file
echo "Checking for config file..."
if [ -f "./vite.config.vercel.mjs" ]; then
    echo "Using vite.config.vercel.mjs"
    CONFIG="vite.config.vercel.mjs"
else
    echo "vite.config.vercel.mjs not found, using default config"
    CONFIG="vite.config.js"
fi

# Ensure terser is installed
echo "Checking for terser..."
if ! npm list terser --depth=0 > /dev/null 2>&1; then
    echo "terser not found, installing..."
    npm install --no-save terser
fi

# Run Vite build with config
echo "Running Vite build with config: $CONFIG"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
NODE_OPTIONS="--no-warnings" npx vite build --config $CONFIG

if [ $? -eq 0 ]; then
    echo "Build completed successfully!"
    echo "Content of dist directory:"
    ls -la ./dist/
else
    echo "Build failed with error code: $?"
    exit 1
fi

# Bake per-route <head> metadata into dist so crawlers get the right title and
# canonical without running JS. Must come after vite build — emptyOutDir wipes
# dist. Non-fatal by design: a prerender failure costs SEO, never the deploy.
# PLAYWRIGHT_BROWSERS_PATH=0 puts Chromium in node_modules, which Vercel caches.
echo "Prerendering per-route metadata..."
if PLAYWRIGHT_BROWSERS_PATH=0 npx --yes playwright install chromium \
   && PLAYWRIGHT_BROWSERS_PATH=0 node ../scripts/prerender.mjs; then
    echo "Prerender completed successfully!"
else
    echo "WARNING: prerender skipped or incomplete — deploying SPA shell only"
fi