import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, columnIndexToLetterA1InputSchema, columnIndexToLetterA1OutputSchema } from "./index.js";
describe("csv/column-index-to-letter-a1", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, columnIndexToLetterA1InputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, columnIndexToLetterA1OutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "column": 16384
    })).toEqual({ ok: true, output: {
      "letters": "XFD"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "column": 26
    })).toEqual({ ok: true, output: {
      "letters": "Z"
    } });
    expect(tool.execute({
      "column": 27
    })).toEqual({ ok: true, output: {
      "letters": "AA"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "column", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "column": 0
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "column", code: "out_of_range" }] } });
  });

});
