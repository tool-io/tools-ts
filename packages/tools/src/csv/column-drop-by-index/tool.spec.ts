import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, columnDropByIndexInputSchema, columnDropByIndexOutputSchema } from "./index.js";
describe("csv/column-drop-by-index", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, columnDropByIndexInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, columnDropByIndexOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a,b,c",
      "delimiter": ",",
      "indices": [
        0,
        0
      ]
    })).toEqual({ ok: true, output: {
      "csv": "b,c"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "",
      "delimiter": ",",
      "indices": []
    })).toEqual({ ok: true, output: {
      "csv": ""
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "a,b",
      "delimiter": ",",
      "indices": [
        0,
        1
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "indices", code: "empty_columns" }] } });
    expect(tool.execute({
      "csv": "a,b",
      "delimiter": ",",
      "indices": [
        2
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "indices", code: "column_range" }] } });
    expect(tool.execute({
      "csv": "a,b\nc",
      "delimiter": ",",
      "indices": []
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "ragged_rows" }] } });
  });

});
