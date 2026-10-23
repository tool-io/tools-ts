import path from "node:path";
import { pathToFileURL } from "node:url";
import { capture, packageRoot } from "./package-build.mjs";

// Each sample runs in a fresh process; GC figures are retained heap, not peak allocation.
const sample = `
global.gc();
const before = process.memoryUsage();
const start = performance.now();
const discovery = await import(${JSON.stringify(pathToFileURL(path.resolve(process.argv[2] ?? path.join(packageRoot, "dist/discovery.js"))).href)});
const importMs = performance.now() - start;
global.gc();
const imported = process.memoryUsage();
const timed = (run) => { const start = performance.now(); run(); return performance.now()-start; };
const lookupMs = timed(() => discovery.getToolMetadata("body-mass-index"));
const listingMs = timed(() => discovery.listTools({limit:20}));
global.gc(); const listed = process.memoryUsage();
const firstSearchMs = timed(() => discovery.searchTools("median",{limit:20}));
const warm=[];for(let i=0;i<20;i++)warm.push(timed(()=>discovery.searchTools("median",{limit:20})));
global.gc();const searched=process.memoryUsage();warm.sort((a,b)=>a-b);
console.log(JSON.stringify({node:process.version,tools:discovery.toolCatalogSize,importMs,lookupMs,listingMs,firstSearchMs,warmSearchMedianMs:warm[10],importHeapBytes:imported.heapUsed-before.heapUsed,listingHeapBytes:listed.heapUsed-before.heapUsed,searchHeapBytes:searched.heapUsed-before.heapUsed,rssBytes:searched.rss}));
`;
const samples = [];
for (let i = 0; i < 3; i++)
  samples.push(
    JSON.parse(
      await capture(process.execPath, [
        "--expose-gc",
        "--input-type=module",
        "--eval",
        sample,
      ]),
    ),
  );
console.log(JSON.stringify({ schemaVersion: 1, samples }, null, 2));
