import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const root = path.resolve(import.meta.dirname, "..");
const schema = JSON.parse(
  await readFile(
    path.join(root, "contracts/portable-value.schema.json"),
    "utf8",
  ),
);
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);

describe("portable value JSON Schema", () => {
  it("accepts representative Version 1 values", () => {
    for (const value of [
      {
        kind: "tool.io/quantity",
        unit: "m",
        value: 1.25,
        version: 1,
      },
      {
        calendar: "gregory",
        kind: "tool.io/date",
        value: "2026-09-12",
        version: 1,
      },
      {
        kind: "tool.io/file",
        mediaType: "text/plain",
        name: "note.txt",
        sizeBytes: 5,
        source: { data: "aGVsbG8=", kind: "base64" },
        version: 1,
      },
    ]) {
      assert.equal(validate(value), true, JSON.stringify(validate.errors));
    }
  });

  it("rejects unknown properties", () => {
    assert.equal(
      validate({
        kind: "tool.io/quantity",
        privateState: true,
        unit: "m",
        value: 1,
        version: 1,
      }),
      false,
    );
  });
});
