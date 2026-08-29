import { describe, expect, it } from "vitest";
import {
  calculateJsonToTable,
  jsonToTableExample,
  runJsonToTable,
} from "./tool.js";

describe("convert/json-to-table", () => {
  it("creates the canonical example table", () => {
    expect(runJsonToTable(jsonToTableExample.input)).toEqual({
      ok: true,
      output: jsonToTableExample.output,
    });
  });

  it("uses first-seen object keys and null for missing values", () => {
    const { table } = calculateJsonToTable({
      json: '[{"a":1},{"b":2}]',
    });
    expect(table.schema.fields.map((field) => field.id)).toEqual(["a", "b"]);
    expect(table.rows).toEqual([
      [1, null],
      [null, 2],
    ]);
    expect(table.schema.fields.every((field) => field.nullable)).toBe(true);
  });

  it("supports named array rows and rejects inconsistent widths", () => {
    expect(
      calculateJsonToTable({
        columnNames: ["Name", "Value"],
        json: '[["alpha",1],["beta",2]]',
      }).table.schema.fields.map((field) => field.id),
    ).toEqual(["name", "value"]);
    expect(runJsonToTable({ json: "[[1,2],[3]]" })).toMatchObject({
      error: {
        issues: [{ code: "inconsistent_row_count", field: "json" }],
      },
      ok: false,
    });
  });

  it("rejects mixed row shapes", () => {
    expect(runJsonToTable({ json: '[{"a":1},[2]]' })).toMatchObject({
      error: { issues: [{ code: "mixed_row_shapes", field: "json" }] },
      ok: false,
    });
  });
});
