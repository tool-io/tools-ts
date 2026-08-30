import { describe, expect, it } from "vitest";
import {
  randomHslColorExample,
  randomHslColorValueCount,
  runRandomHslColor,
} from "./tool.js";

describe("Random HSL Color Generator", () => {
  it("executes the canonical example at both repertoire boundaries", () => {
    expect(JSON.parse(JSON.stringify(randomHslColorExample))).toEqual(randomHslColorExample);
    expect(runRandomHslColor({}, { random: () => 0 })).toEqual({ ok: true, output: {"hue": 0, "saturationPercent": 0, "lightnessPercent": 0} });
    expect(runRandomHslColor({}, { random: () => 1 - Number.EPSILON })).toEqual({ ok: true, output: {"hue": 359, "saturationPercent": 100, "lightnessPercent": 100} });
  });

  it("declares the exact Cartesian-product size", () => {
    expect(randomHslColorValueCount).toBe(3672360);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHslColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomHslColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
