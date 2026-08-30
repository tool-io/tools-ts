import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, animationKeyframePercentEvenSplitInputSchema, animationKeyframePercentEvenSplitOutputSchema } from "./index.js";
describe("css/animation-keyframe-percent-even-split", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, animationKeyframePercentEvenSplitInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, animationKeyframePercentEvenSplitOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "count": 3
    })).toEqual({ ok: true, output: {
      "percentages": [
        0,
        50,
        100
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "count": 2
    })).toEqual({ ok: true, output: {
      "percentages": [
        0,
        100
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "count", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "count": 1
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "count", code: "out_of_range" }] } });
  });

  it("preserves ordered endpoints without rounding interior fractions", () => {
    const result = tool.execute({ count: 4 });
    if (!result.ok) throw new Error("Expected four percentages.");
    expect(result.output.percentages).toEqual([0, 33.333333333333336, 66.66666666666667, 100]);
  });
});
