import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  expectedDistFiles,
  capture,
  fileSetIssues,
  readBuildConfiguration,
} from "./package-build.mjs";

describe("production package contents", () => {
  it("preserves command arguments and both diagnostic streams on failure", async () => {
    await assert.rejects(
      capture(process.execPath, [
        "--eval",
        "process.stdout.write('compiler output'); process.stderr.write('compiler error'); process.exitCode = 1;",
      ]),
      (error) =>
        /--eval/.test(error.message) &&
        /compiler output/.test(error.message) &&
        /compiler error/.test(error.message),
    );
  });
  it("derives emitted artifacts from the build compiler options", () => {
    assert.deepEqual(
      [
        ...expectedDistFiles({
          files: ["./src/example/tool.ts", "./src/ambient.d.ts"],
          compilerOptions: {
            rootDir: "./src",
            declaration: true,
            declarationMap: true,
            sourceMap: true,
          },
        }),
      ].sort(),
      [
        "example/tool.d.ts",
        "example/tool.d.ts.map",
        "example/tool.js",
        "example/tool.js.map",
      ],
    );
    assert.deepEqual(
      [
        ...expectedDistFiles({
          files: ["./src/example/tool.ts"],
          compilerOptions: { rootDir: "./src" },
        }),
      ].sort(),
      ["example/tool.js"],
    );
    assert.deepEqual(
      [
        ...expectedDistFiles({
          files: ["./src/example/tool.ts"],
          compilerOptions: {
            rootDir: "./src",
            declaration: true,
            declarationMap: false,
            sourceMap: false,
          },
        }),
      ].sort(),
      ["example/tool.d.ts", "example/tool.js"],
    );
  });

  it("rejects obsolete artifacts even when every required file exists", () => {
    assert.deepEqual(
      fileSetIssues(
        new Set(["current.js"]),
        new Set(["current.js", "removed.js"]),
      ),
      ["Unexpected build artifact: removed.js"],
    );
    assert.deepEqual(fileSetIssues(new Set(["current.js"]), new Set()), [
      "Missing build artifact: current.js",
    ]);
    assert.deepEqual(
      fileSetIssues(new Set(["current.js"]), new Set(["current.js"])),
      [],
    );
  });

  it("keeps compiler-only bucket shapes out of production artifacts", () => {
    const files = expectedDistFiles({
      files: [
        "./src/generated/registry-buckets/000.generated.ts",
        "./src/generated/registry-buckets/000.generated.typecheck.ts",
      ],
      compilerOptions: { rootDir: "./src", declaration: true },
    });
    assert.ok(files.has("generated/registry-buckets/000.generated.js"));
    assert.ok(files.has("generated/registry-buckets/000.generated.d.ts"));
    assert.ok(![...files].some((file) => file.includes(".typecheck.")));
  });

  it("excludes tests and every existing Vitest helper from the real production compilation", async () => {
    const configuration = await readBuildConfiguration();
    assert.ok(configuration.files.length > 1000);
    for (const file of configuration.files)
      assert.doesNotMatch(
        file,
        /(?:\.(?:spec|test)|-(?:testing|test-support|spec-support|spec))\.ts$/,
      );
    assert.ok(
      configuration.files.some((file) => file.endsWith("/core/simple.ts")),
    );
  });
});
import { packageBudgetIssues, packageBudgets } from "./package-budgets.mjs";

describe("reviewed package budgets", () => {
  it("accepts the measured initial full-collection archive", () => {
    assert.deepEqual(
      packageBudgetIssues({
        compressedBytes: 33_469_996,
        unpackedBytes: 235_179_884,
        files: 163_114,
      }),
      [],
    );
  });
  it("accepts the ceilings and rejects growth beyond any one of them", () => {
    assert.deepEqual(packageBudgetIssues(packageBudgets), []);
    for (const [key, value] of Object.entries(packageBudgets))
      assert.equal(
        packageBudgetIssues({ ...packageBudgets, [key]: value + 1 }).length,
        1,
      );
  });
  it("rejects missing and nonfinite metrics rather than bypassing ceilings", () => {
    for (const value of [undefined, NaN, Infinity, -1, 0, 1.5])
      assert.equal(
        packageBudgetIssues({ ...packageBudgets, compressedBytes: value })
          .length,
        1,
      );
  });
});
