import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import { gzipSync } from "node:zlib";
import { build } from "vite";
import { packageRoot, root } from "./package-build.mjs";

const temporary = await mkdtemp(path.join(tmpdir(), "tool-io-browser-"));
const fixtures = [
  {
    name: "root",
    gzipBudget: 4096,
    allowedTools: [],
    expected: { ok: true, output: { value: 42 } },
  },
  {
    name: "body-mass-index",
    gzipBudget: 16384,
    allowedTools: ["body-mass-index"],
    expected: { ok: true, output: { bmi: 20 } },
  },
  {
    name: "sha-256",
    gzipBudget: 32768,
    allowedTools: ["hash/sha-256"],
    expectedHash:
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  },
];
try {
  await mkdir(path.join(temporary, "node_modules/@tool.io"), {
    recursive: true,
  });
  await symlink(
    packageRoot,
    path.join(temporary, "node_modules/@tool.io/tools"),
    "junction",
  );
  const report = [];
  for (const fixture of fixtures) {
    const entry = path.join(temporary, `${fixture.name}.ts`);
    await writeFile(
      entry,
      await readFile(
        path.join(root, "tests/consumers/browser", `${fixture.name}.ts`),
      ),
    );
    const modules = new Set();
    const result = await build({
      configFile: false,
      root: temporary,
      logLevel: "silent",
      plugins: [
        {
          name: "tool.io-package-boundary",
          moduleParsed(module) {
            modules.add(module.id);
          },
        },
      ],
      build: {
        write: false,
        minify: true,
        target: "es2022",
        sourcemap: false,
        lib: { entry, name: "ToolConsumer", formats: ["iife"] },
      },
    });
    const output = (Array.isArray(result) ? result : [result]).flatMap(
      (r) => r.output,
    );
    const chunks = output.filter((o) => o.type === "chunk");
    assert.equal(
      chunks.length,
      1,
      `${fixture.name}: unexpected split or dynamic imports`,
    );
    assert.equal(output.length, 1, `${fixture.name}: unexpected assets`);
    const chunk = chunks[0];
    for (const id of modules) {
      assert.doesNotMatch(
        id,
        /(?:(?:catalog|contracts|examples)\.generated\.json|\/(?:registry|discovery)\.[jt]s|vitest|svelte|__vite-browser-external|(?:^|\/)node:)/,
        `${fixture.name}: forbidden module ${id}`,
      );
      if (id.includes(`${packageRoot}/dist/`) && id.endsWith("/tool.js")) {
        const tool = id.slice(
          `${packageRoot}/dist/`.length,
          -"/tool.js".length,
        );
        assert.ok(
          fixture.allowedTools.includes(tool),
          `${fixture.name}: unrelated tool ${tool}`,
        );
      }
    }
    assert.deepEqual(chunk.imports, []);
    assert.deepEqual(chunk.dynamicImports, []);
    const context = vm.createContext({});
    vm.runInContext(chunk.code, context, { timeout: 2000 });
    const value = JSON.parse(
      vm.runInContext("JSON.stringify(ToolConsumer.result)", context),
    );
    if (fixture.expectedHash) {
      assert.equal(value.ok, true);
      assert.ok(
        Object.values(value.output).includes(fixture.expectedHash),
        "SHA-256 browser vector differs",
      );
    } else if (fixture.name === "body-mass-index") {
      assert.equal(value.ok, true);
      assert.equal(value.output.bmi, 20);
    } else assert.deepEqual(value, fixture.expected);
    const gzipBytes = gzipSync(chunk.code).length;
    assert.ok(
      gzipBytes <= fixture.gzipBudget,
      `${fixture.name}: ${gzipBytes} gzip bytes exceed ${fixture.gzipBudget}`,
    );
    report.push({
      fixture: fixture.name,
      bytes: Buffer.byteLength(chunk.code),
      gzipBytes,
      gzipBudget: fixture.gzipBudget,
      modules: modules.size,
    });
  }
  console.log(
    JSON.stringify(
      { schemaVersion: 1, node: process.version, fixtures: report },
      null,
      2,
    ),
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
