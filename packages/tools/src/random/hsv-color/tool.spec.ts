import { describe, expect, it } from "vitest";
import {
  randomHsvColorExample,
  randomHsvColorValueCount,
  runRandomHsvColor,
} from "./tool.js";

describe("Random HSV Color Generator", () => {
  it("executes the canonical example at both repertoire boundaries", () => {
    expect(JSON.parse(JSON.stringify(randomHsvColorExample))).toEqual(randomHsvColorExample);
    expect(runRandomHsvColor({}, { random: () => 0 })).toEqual({ ok: true, output: {"hue": 0, "saturationPercent": 0, "valuePercent": 0} });
    expect(runRandomHsvColor({}, { random: () => 1 - Number.EPSILON })).toEqual({ ok: true, output: {"hue": 359, "saturationPercent": 100, "valuePercent": 100} });
  });

  it("declares the exact Cartesian-product size", () => {
    expect(randomHsvColorValueCount).toBe(3672360);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHsvColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomHsvColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
