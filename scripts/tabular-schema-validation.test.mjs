import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import Ajv2020 from "ajv/dist/2020.js";

const root = path.resolve(import.meta.dirname, "..");
const readSchema = (name) =>
  readFile(path.join(root, "contracts", name), "utf8").then(JSON.parse);
const [tableSchema, presentationSchema] = await Promise.all([
  readSchema("table-data.schema.json"),
  readSchema("tabular-presentation.schema.json"),
]);
const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addSchema(tableSchema);
const validateTable = ajv.getSchema(tableSchema.$id);
const validatePresentation = ajv.compile(presentationSchema);

const table = {
  kind: "tool.io/table",
  rows: [["A", 2]],
  schema: {
    fields: [
      { dataType: { kind: "string" }, id: "category", nullable: false },
      {
        dataType: { bits: 32, kind: "integer", signed: false },
        id: "count",
        nullable: false,
      },
    ],
  },
  version: 1,
};

describe("tabular JSON Schemas", () => {
  it("accepts representative TableData", () => {
    assert.equal(
      validateTable?.(table),
      true,
      JSON.stringify(validateTable?.errors),
    );
  });

  it("accepts chart documents over TableData", () => {
    assert.equal(
      validatePresentation({
        data: table,
        kind: "tool.io/chart-document",
        spec: {
          encoding: {
            category: { field: "category" },
            theta: { field: "count" },
          },
          kind: "tool.io/chart-spec",
          type: "pie",
          version: 1,
        },
        version: 1,
        warnings: [],
      }),
      true,
      JSON.stringify(validatePresentation.errors),
    );
  });

  it("rejects old unbranded discriminators", () => {
    assert.equal(validateTable?.({ ...table, kind: "toolio/table" }), false);
  });
});
