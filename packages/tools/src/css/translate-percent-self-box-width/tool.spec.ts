import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, translatePercentSelfBoxWidthInputSchema, translatePercentSelfBoxWidthOutputSchema } from "./index.js";
describe("css/translate-percent-self-box-width", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, translatePercentSelfBoxWidthInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, translatePercentSelfBoxWidthOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "referenceWidth": 80,
      "percent": 125
    })).toEqual({ ok: true, output: {
      "translation": 100
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "referenceWidth": 0,
      "percent": -50
    })).toEqual({ ok: true, output: {
      "translation": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "referenceWidth", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ referenceWidth: Number.MAX_VALUE, percent: 200 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "percent", code: "numeric_range" }] } });
  });

  it("retains a representable translation when percent divided by 100 underflows", () => {
    const result = tool.execute({ referenceWidth: 1e308, percent: Number.MIN_VALUE });
    if (!result.ok) throw new Error("Expected a representable translation.");
    expect(result.output.translation).toBeCloseTo(4.940656458412466e-18, 30);
  });
});
