import { describe, expect, it } from "vitest";
import {
  randomRgbaColorExample,
  randomRgbaColorValueCount,
  runRandomRgbaColor,
} from "./tool.js";

describe("Random RGBA Color Generator", () => {
  it("executes the canonical example at both repertoire boundaries", () => {
    expect(JSON.parse(JSON.stringify(randomRgbaColorExample))).toEqual(randomRgbaColorExample);
    expect(runRandomRgbaColor({}, { random: () => 0 })).toEqual({ ok: true, output: {"red": 0, "green": 0, "blue": 0, "alpha": 0} });
    expect(runRandomRgbaColor({}, { random: () => 1 - Number.EPSILON })).toEqual({ ok: true, output: {"red": 255, "green": 255, "blue": 255, "alpha": 255} });
  });

  it("declares the exact Cartesian-product size", () => {
    expect(randomRgbaColorValueCount).toBe(4294967296);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomRgbaColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomRgbaColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
