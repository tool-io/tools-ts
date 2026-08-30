import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, meterOptimumLowHighBandClassifierInputSchema, meterOptimumLowHighBandClassifierOutputSchema } from "./index.js";
describe("html/meter-optimum-low-high-band-classifier", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, meterOptimumLowHighBandClassifierInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, meterOptimumLowHighBandClassifierOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "value": 50,
  "min": 0,
  "low": 20,
  "high": 80,
  "max": 100,
  "optimum": 20
})).toEqual({ ok: true, output: {
  "effectiveValue": 50,
  "effectiveOptimum": 20,
  "band": "optimum"
} });
    expect(tool.execute({
  "value": 10,
  "min": 0,
  "low": 20,
  "high": 80,
  "max": 100,
  "optimum": 90
})).toEqual({ ok: true, output: {
  "effectiveValue": 10,
  "effectiveOptimum": 90,
  "band": "least-good"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "value": -5,
  "min": 0,
  "low": 20,
  "high": 80,
  "max": 100,
  "optimum": -2
})).toEqual({ ok: true, output: {
  "effectiveValue": 0,
  "effectiveOptimum": 0,
  "band": "optimum"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, low: 85 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "low", code: "invalid_bounds" }] } });
  });

  it("treats an optimum on the high boundary as the middle optimum region", () => {
    expect(tool.execute({ value: 80, min: 0, low: 20, high: 80, max: 100, optimum: 80 })).toEqual({ ok: true, output: { effectiveValue: 80, effectiveOptimum: 80, band: "optimum" } });
    expect(tool.execute({ value: 90, min: 0, low: 20, high: 80, max: 100, optimum: 80 })).toEqual({ ok: true, output: { effectiveValue: 90, effectiveOptimum: 80, band: "suboptimal" } });
  });
});
