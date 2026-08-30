import { describe, expect, it } from "vitest";
import {
  randomRgbColorExample,
  randomRgbColorValueCount,
  runRandomRgbColor,
} from "./tool.js";

describe("Random RGB Color Generator", () => {
  it("executes the canonical example at both repertoire boundaries", () => {
    expect(JSON.parse(JSON.stringify(randomRgbColorExample))).toEqual(randomRgbColorExample);
    expect(runRandomRgbColor({}, { random: () => 0 })).toEqual({ ok: true, output: {"red": 0, "green": 0, "blue": 0} });
    expect(runRandomRgbColor({}, { random: () => 1 - Number.EPSILON })).toEqual({ ok: true, output: {"red": 255, "green": 255, "blue": 255} });
  });

  it("declares the exact Cartesian-product size", () => {
    expect(randomRgbColorValueCount).toBe(16777216);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomRgbColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomRgbColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
