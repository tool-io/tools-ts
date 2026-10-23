import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { capture, packageRoot, root } from "./package-build.mjs";

if (process.argv.slice(2).some((argument) => argument !== "--check"))
  throw new Error("Usage: benchmark-discovery-scale.mjs [--check]");
const budget = JSON.parse(
  await readFile(
    path.join(root, "tests/discovery-performance-budgets.json"),
    "utf8",
  ),
);
const environment = {
  platform: process.platform,
  architecture: process.arch,
  cpu: os.cpus()[0].model,
  nodeMajor: Number(process.versions.node.split(".")[0]),
};
if (process.argv.includes("--check"))
  assert.deepEqual(
    environment,
    budget.reference,
    "Performance ceilings apply only to the named reference environment.",
  );
const catalog = JSON.parse(
  await readFile(path.join(packageRoot, "catalog.generated.json"), "utf8"),
);
const temporary = await mkdtemp(
  path.join(os.tmpdir(), "tool-io-discovery-scale-"),
);
try {
  const prefix = "toolioscalefixture";
  const entries = Array.from({ length: budget.entries }, (_, index) => {
    const id = `${prefix}/item-${String(index).padStart(6, "0")}`;
    return {
      ...catalog.entries[index % catalog.entries.length],
      id,
      canonicalUrl: `/${id}`,
      packageExport: `@tool.io/tools/${id}`,
    };
  });
  assert.ok(
    catalog.entries.every(
      (entry) =>
        ![entry.title, ...entry.aliases].some(
          (value) => value.toLowerCase() === prefix,
        ),
    ),
  );
  const payload = { entries, schemaVersion: 1 };
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
  const data = path.join(temporary, "catalog.json"),
    loader = path.join(temporary, "loader.mjs");
  await writeFile(
    data,
    JSON.stringify({ catalogFingerprint: fingerprint, ...payload }),
  );
  await writeFile(
    loader,
    `export async function load(url,context,nextLoad){return nextLoad(url===${JSON.stringify(pathToFileURL(path.join(packageRoot, "catalog.generated.json")).href)}?${JSON.stringify(pathToFileURL(data).href)}:url,context);}`,
  );
  const source = `
import assert from "node:assert/strict";
global.gc(); const before=process.memoryUsage().heapUsed;
let start=performance.now();
const discovery=await import(${JSON.stringify(pathToFileURL(path.join(packageRoot, "dist/discovery.js")).href)});
const importMs=performance.now()-start;
assert.equal(discovery.toolCatalogSize,${budget.entries});
start=performance.now(); const metadata=discovery.getToolMetadata("${prefix}/item-050000"); const lookupMs=performance.now()-start;
assert.equal(metadata.id,"${prefix}/item-050000");
start=performance.now(); const first=discovery.searchTools("${prefix}",{limit:50}); const firstSearchMs=performance.now()-start;
assert.equal(first.total,${budget.entries}); assert.equal(first.entries.length,50);
assert.deepEqual(first.entries.map(entry=>entry.id),Array.from({length:50},(_,i)=>"${prefix}/item-"+String(i).padStart(6,"0")));
const second=discovery.searchTools("${prefix}",{limit:50,offset:50});
assert.deepEqual(second.entries.map(entry=>entry.id),Array.from({length:50},(_,i)=>"${prefix}/item-"+String(i+50).padStart(6,"0")));
const warm=[];for(let i=0;i<20;i++){start=performance.now();discovery.searchTools("${prefix}",{limit:50});warm.push(performance.now()-start);}
warm.sort((a,b)=>a-b);global.gc();
console.log(JSON.stringify({importMs,lookupMs,firstSearchMs,warmSearchMedianMs:warm[10],retainedHeapBytes:process.memoryUsage().heapUsed-before,rssBytes:process.memoryUsage().rss}));
`;
  const samples = [];
  for (let index = 0; index < budget.samples; index++)
    samples.push(
      JSON.parse(
        await capture(process.execPath, [
          "--expose-gc",
          "--no-warnings",
          "--experimental-loader",
          loader,
          "--input-type=module",
          "--eval",
          source,
        ]),
      ),
    );
  const medians = Object.fromEntries(
    Object.keys(budget.ceilings).map((key) => [
      key,
      [...samples].map((sample) => sample[key]).sort((a, b) => a - b)[
        Math.floor(samples.length / 2)
      ],
    ]),
  );
  const violations = Object.entries(budget.ceilings)
    .filter(([key, ceiling]) => medians[key] > ceiling)
    .map(([key, ceiling]) => ({ metric: key, actual: medians[key], ceiling }));
  const report = {
    schemaVersion: 1,
    environment,
    node: process.version,
    sourceCatalogFingerprint: catalog.catalogFingerprint,
    entries: entries.length,
    samples,
    medians,
    ceilings: budget.ceilings,
    violations,
    enforced: process.argv.includes("--check"),
    note: "Canonical discovery engine, real metadata projected to unique synthetic IDs; every search matches 100,000 rows. No executable tool is imported. Retained heap is not peak allocation.",
  };
  await mkdir(path.join(root, ".log"), { recursive: true });
  await writeFile(
    path.join(root, ".log", "discovery-scale-benchmark.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  if (process.argv.includes("--check") && violations.length)
    process.exitCode = 1;
} finally {
  await rm(temporary, { recursive: true, force: true });
}
