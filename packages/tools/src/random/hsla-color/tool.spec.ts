import { describe, expect, it } from "vitest";
import {
  randomHslaColorExample,
  randomHslaColorValueCount,
  runRandomHslaColor,
} from "./tool.js";

describe("Random HSLA Color Generator", () => {
  it("executes the canonical example at both repertoire boundaries", () => {
    expect(JSON.parse(JSON.stringify(randomHslaColorExample))).toEqual(randomHslaColorExample);
    expect(runRandomHslaColor({}, { random: () => 0 })).toEqual({ ok: true, output: {"hue": 0, "saturationPercent": 0, "lightnessPercent": 0, "alpha": 0} });
    expect(runRandomHslaColor({}, { random: () => 1 - Number.EPSILON })).toEqual({ ok: true, output: {"hue": 359, "saturationPercent": 100, "lightnessPercent": 100, "alpha": 255} });
  });

  it("declares the exact Cartesian-product size", () => {
    expect(randomHslaColorValueCount).toBe(940124160);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHslaColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomHslaColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
