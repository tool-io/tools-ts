import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, backgroundPositionPercentAlignmentInputSchema, backgroundPositionPercentAlignmentOutputSchema } from "./index.js";
describe("css/background-position-percent-alignment", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, backgroundPositionPercentAlignmentInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, backgroundPositionPercentAlignmentOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "areaSize": 300,
      "imageSize": 400,
      "percent": 25
    })).toEqual({ ok: true, output: {
      "offset": -25
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "areaSize": 300,
      "imageSize": 300,
      "percent": 50
    })).toEqual({ ok: true, output: {
      "offset": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "areaSize", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ areaSize: Number.MAX_VALUE, imageSize: 0, percent: 200 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "percent", code: "numeric_range" }] } });
  });

});
