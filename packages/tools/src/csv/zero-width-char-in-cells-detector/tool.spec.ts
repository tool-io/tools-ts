import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, zeroWidthCharInCellsDetectorInputSchema, zeroWidthCharInCellsDetectorOutputSchema } from "./index.js";
describe("csv/zero-width-char-in-cells-detector", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, zeroWidthCharInCellsDetectorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, zeroWidthCharInCellsDetectorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "⁠"
      ]
    })).toEqual({ ok: true, output: {
      "locations": [
        {
          "cell": 0,
          "offset": 0,
          "codePoint": 8288
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [
        "plain"
      ]
    })).toEqual({ ok: true, output: {
      "locations": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
