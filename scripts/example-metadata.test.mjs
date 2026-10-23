import assert from "node:assert/strict";
import { test } from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { readFile } from "node:fs/promises";
import {
  createExampleMetadata,
  createExampleCollection,
  exampleCollectionFingerprint,
} from "./example-metadata.mjs";

const record = (id = "statistics/median") =>
  createExampleMetadata({
    id,
    contractVersion: 1,
    contractFingerprint: "a".repeat(64),
    example: { input: { values: [3, 1, 2] }, output: { median: 2 } },
  });
test("exports authored examples without evaluating or changing their values", () => {
  const value = record();
  assert.deepEqual(value.example, {
    input: { values: [3, 1, 2] },
    output: { median: 2 },
  });
  assert.deepEqual(
    createExampleMetadata({ ...value, example: { input: "001" } }).example,
    { input: "001" },
  );
});
test("rejects examples which lose values or types during JSON serialization", () => {
  const cycle = {};
  cycle.self = cycle;
  for (const input of [undefined, NaN, Infinity, 1n, cycle, new Date(0)])
    assert.throws(() =>
      createExampleMetadata({ ...record(), example: { input } }),
    );
  for (const example of [null, [], {}, { input: {}, unexpected: true }])
    assert.throws(() => createExampleMetadata({ ...record(), example }));
});
test("binds deterministic collections to their catalog and detects example changes", () => {
  const first = record("statistics/first"),
    second = record("statistics/second");
  const collection = createExampleCollection("b".repeat(64), [second, first]);
  assert.deepEqual(
    collection.examples.map((entry) => entry.id),
    [first.id, second.id],
  );
  assert.equal(
    collection.examplesFingerprint,
    exampleCollectionFingerprint(collection),
  );
  assert.notEqual(
    collection.examplesFingerprint,
    createExampleCollection("c".repeat(64), [first, second])
      .examplesFingerprint,
  );
  assert.notEqual(
    collection.examplesFingerprint,
    createExampleCollection("b".repeat(64), [
      first,
      { ...second, example: { input: 42 } },
    ]).examplesFingerprint,
  );
  assert.throws(() => createExampleCollection("b".repeat(64), [first, first]));
});
test("validates metadata against the published collection schema", async () => {
  const schema = JSON.parse(
    await readFile(
      new URL(
        "../contracts/tool-example-collection.schema.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const validate = new Ajv2020({ strict: true }).compile(schema);
  const collection = createExampleCollection("b".repeat(64), [record()]);
  assert.equal(validate(collection), true);
  assert.equal(validate({ ...collection, schemaVersion: 2 }), false);
  assert.equal(
    validate({ ...collection, examples: [{ ...record(), example: {} }] }),
    false,
  );
});
