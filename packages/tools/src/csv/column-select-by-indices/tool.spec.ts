import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, columnSelectByIndicesInputSchema, columnSelectByIndicesOutputSchema } from "./index.js";
describe("csv/column-select-by-indices", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, columnSelectByIndicesInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, columnSelectByIndicesOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a,b",
      "delimiter": ",",
      "indices": [
        1,
        1
      ]
    })).toEqual({ ok: true, output: {
      "csv": "b,b"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "\"\"",
      "delimiter": ",",
      "indices": [
        0
      ]
    })).toEqual({ ok: true, output: {
      "csv": "\"\""
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "a,b",
      "delimiter": ",",
      "indices": []
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "indices", code: "out_of_range" }] } });
    expect(tool.execute({
      "csv": "a,b",
      "delimiter": ",",
      "indices": [
        2
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "indices", code: "column_range" }] } });
  });

  it("bounds repeated-column materialization before allocation", () => {
    expect(tool.execute({ csv: "a\nb", delimiter: ",", indices: Array<number>(10000).fill(0) })).toMatchObject({ ok: false, error: { issues: [{ field: "indices", code: "resource_limit" }] } });
    expect(tool.execute({ csv: "x".repeat(1000), delimiter: ",", indices: Array<number>(101).fill(0) })).toMatchObject({ ok: false, error: { issues: [{ field: "indices", code: "resource_limit" }] } });
  });
});
