import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { promisify } from "node:util";
import {
  createCompilerBatches,
  withRegistryBucketTypes,
} from "./compiler-batches.mjs";
import { root } from "./package-build.mjs";

test("partitions every source/test root exactly once and isolates actual registry buckets", () => {
  const source = path.resolve("fixture/src");
  const files = [
    "index.ts",
    "core/contract.ts",
    "alpha/a.ts",
    "alpha/a.spec.ts",
    "alpha/b.ts",
    "generated/registry.generated.ts",
    ...Array.from(
      { length: 13 },
      (_, i) => `generated/registry-buckets/${i}.generated.ts`,
    ),
  ].map((file) => path.join(source, file));
  const batches = createCompilerBatches(files, source, 2);
  assert.deepEqual(
    batches.flatMap((batch) => batch.files).sort(),
    [...files].sort(),
  );
  assert.ok(batches.every((batch) => batch.files.length <= 2));
  assert.equal(
    batches
      .filter((batch) => batch.name.startsWith("registry-buckets"))
      .flatMap((batch) => batch.files).length,
    13,
  );
  assert.throws(() => createCompilerBatches([files[0], files[0]], source));
  assert.throws(() =>
    createCompilerBatches([path.resolve("elsewhere.ts")], source),
  );
});

test("one temporary declaration isolates indirect imports while real bucket errors remain checked", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "toolio-bucket-types-"));
  const execute = promisify(execFile);
  const compiler = path.join(root, "node_modules/typescript/bin/tsc");
  try {
    const sourceRoot = path.join(directory, "src");
    const bucketRoot = path.join(sourceRoot, "generated/registry-buckets");
    await mkdir(bucketRoot, { recursive: true });
    await writeFile(path.join(directory, "package.json"), '{"type":"module"}');
    await writeFile(
      path.join(sourceRoot, "generated/registry.generated.ts"),
      "export type RegisteredToolModule = { value: number };\n",
    );
    const entry = path.join(sourceRoot, "index.ts");
    await writeFile(
      entry,
      'import { toolModuleLoaders } from "./generated/registry-buckets/000.generated.js"; const result: Promise<{value:number}> = toolModuleLoaders.example();',
    );
    const actual = path.join(bucketRoot, "000.generated.ts");
    const broken =
      'export const toolModuleLoaders: Record<string, () => Promise<{value:number}>> = {example: () => "wrong"};';
    await writeFile(actual, broken);
    await writeFile(
      path.join(bucketRoot, "001.generated.ts"),
      "export const toolModuleLoaders = {};\n",
    );
    const compile = async (files) => {
      const project = path.join(directory, "tsconfig.json");
      await writeFile(
        project,
        JSON.stringify({
          compilerOptions: {
            strict: true,
            noEmit: true,
            module: "NodeNext",
            target: "ES2022",
            moduleSuffixes: [".typecheck", ""],
          },
          files,
        }),
      );
      return execute(
        process.execPath,
        [compiler, "-p", project, "--listFiles"],
        { maxBuffer: 65536 },
      );
    };
    await withRegistryBucketTypes({
      sourceRoot,
      temporary: directory,
      run: async () => {
        const first = await stat(
          path.join(bucketRoot, "000.generated.typecheck.ts"),
        );
        const second = await stat(
          path.join(bucketRoot, "001.generated.typecheck.ts"),
        );
        assert.equal(
          first.ino,
          second.ino,
          "Resolution paths must share one declaration, not copied boilerplate",
        );
        assert.equal(first.dev, second.dev);
        const indirect = await compile([entry]);
        assert.ok(
          !indirect.stdout.includes(actual),
          "Indirect imports must not load the real bucket graph",
        );
        const batches = createCompilerBatches([entry, actual], sourceRoot);
        const bucket = batches.find((batch) =>
          batch.name.startsWith("registry-buckets"),
        );
        await assert.rejects(
          () => compile(bucket.files),
          (error) => /TS2322/.test(error.stdout),
        );
      },
    });
    assert.equal(await readFile(actual, "utf8"), broken);
    assert.ok(
      !(await readdir(bucketRoot)).some((name) => name.includes(".typecheck.")),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("temporary bucket declarations are removed when compilation fails", async () => {
  const directory = await mkdtemp(
    path.join(tmpdir(), "toolio-bucket-cleanup-"),
  );
  try {
    const sourceRoot = path.join(directory, "src");
    const bucketRoot = path.join(sourceRoot, "generated/registry-buckets");
    await mkdir(bucketRoot, { recursive: true });
    await writeFile(path.join(bucketRoot, "000.generated.ts"), "export {};\n");
    await assert.rejects(
      () =>
        withRegistryBucketTypes({
          sourceRoot,
          temporary: directory,
          run: async () => {
            throw new Error("Compiler failed");
          },
        }),
      /Compiler failed/,
    );
    assert.deepEqual(await readdir(bucketRoot), ["000.generated.ts"]);
    assert.ok(
      !(await readdir(directory)).includes("registry-bucket.typecheck.ts"),
    );
    const existing = path.join(bucketRoot, "001.generated.typecheck.ts");
    await writeFile(path.join(bucketRoot, "001.generated.ts"), "export {};\n");
    await writeFile(existing, "keep existing file");
    await assert.rejects(
      () =>
        withRegistryBucketTypes({
          sourceRoot,
          temporary: directory,
          run: async () =>
            assert.fail("A conflicting compiler job must not start"),
        }),
      (error) => error.code === "EEXIST",
    );
    assert.equal(await readFile(existing, "utf8"), "keep existing file");
    assert.ok(
      !(await readdir(bucketRoot)).includes("000.generated.typecheck.ts"),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("the private catalog import keeps JSON out of compiler inference and resolves the same data at runtime", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "toolio-catalog-types-"));
  const execute = promisify(execFile);
  try {
    const manifest = JSON.parse(
      await readFile(path.join(root, "packages/tools/package.json"), "utf8"),
    );
    assert.ok(manifest.files.includes("catalog-data.d.ts"));
    await writeFile(
      path.join(directory, "package.json"),
      JSON.stringify({ type: "module", imports: manifest.imports }),
    );
    await writeFile(
      path.join(directory, "catalog-data.d.ts"),
      await readFile(path.join(root, "packages/tools/catalog-data.d.ts")),
    );
    await writeFile(
      path.join(directory, "catalog.generated.json"),
      '{"schemaVersion":1,"entries":[]}',
    );
    await writeFile(
      path.join(directory, "consumer.mts"),
      'import catalog from "#tool-catalog" with { type: "json" };\n// @ts-expect-error generated data must be narrowed before use\ncatalog.entries;\n',
    );
    const project = path.join(directory, "tsconfig.json");
    await writeFile(
      project,
      JSON.stringify({
        compilerOptions: {
          strict: true,
          noEmit: true,
          module: "NodeNext",
          target: "ES2022",
          resolveJsonModule: true,
        },
        files: ["consumer.mts"],
      }),
    );
    const result = await execute(
      process.execPath,
      [
        path.join(root, "node_modules/typescript/bin/tsc"),
        "-p",
        project,
        "--listFiles",
      ],
      { maxBuffer: 65536 },
    );
    assert.ok(
      result.stdout.includes(path.join(directory, "catalog-data.d.ts")),
    );
    assert.ok(
      !result.stdout.includes(path.join(directory, "catalog.generated.json")),
    );
    await execute(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        'import catalog from "#tool-catalog" with {type:"json"}; if (catalog.schemaVersion !== 1 || catalog.entries.length !== 0) throw new Error("Catalog runtime differs");',
      ],
      { cwd: directory },
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
