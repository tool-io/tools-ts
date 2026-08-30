import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, rowHeadTailSliceNInputSchema, rowHeadTailSliceNOutputSchema } from "./index.js";
describe("csv/row-head-tail-slice-n", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, rowHeadTailSliceNInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, rowHeadTailSliceNOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a\nb\nc",
      "delimiter": ",",
      "hasHeader": false,
      "side": "head",
      "count": 2
    })).toEqual({ ok: true, output: {
      "csv": "a\nb"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "h\na",
      "delimiter": ",",
      "hasHeader": true,
      "side": "tail",
      "count": 0
    })).toEqual({ ok: true, output: {
      "csv": "h"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
