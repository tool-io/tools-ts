import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, eApproxSeriesInputSchema, eApproxSeriesOutputSchema } from "./index.js";

describe("math/e-approx-series", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, eApproxSeriesInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, eApproxSeriesOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      terms: 3,
    })).toEqual({ ok: true, output: {
      value: 2.5,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      terms: 1,
    })).toEqual({ ok: true, output: {
      value: 1,
    } });
    expect(tool.execute({
      terms: 2,
    })).toEqual({ ok: true, output: {
      value: 2,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "invalid_type" }] } });
    expect(tool.execute({
      terms: 4,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      terms: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "invalid_type" }] } });
    expect(tool.execute({
      terms: 0,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "terms", code: "out_of_range" }] } });
  });
  it("approaches e with more terms", () => {
    const result = tool.execute({ terms: 30 });
    if (!result.ok) throw new Error("Expected an approximation");
    expect(result.output.value).toBeCloseTo(Math.E, 14);
  });
});
