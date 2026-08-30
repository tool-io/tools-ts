import { describe, expect, it } from "vitest";
import {
  randomGrayscaleColorExample,
  randomGrayscaleColorValueCount,
  runRandomGrayscaleColor,
} from "./tool.js";

describe("Random Grayscale Color Generator", () => {
  it("executes the canonical example at both repertoire boundaries", () => {
    expect(JSON.parse(JSON.stringify(randomGrayscaleColorExample))).toEqual(randomGrayscaleColorExample);
    expect(runRandomGrayscaleColor({}, { random: () => 0 })).toEqual({ ok: true, output: {"level": 0} });
    expect(runRandomGrayscaleColor({}, { random: () => 1 - Number.EPSILON })).toEqual({ ok: true, output: {"level": 255} });
  });

  it("declares the exact Cartesian-product size", () => {
    expect(randomGrayscaleColorValueCount).toBe(256);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomGrayscaleColor({}, { random: () => sample })).toMatchObject({ error: { issues: [{ code: "invalid_random_source" }] }, ok: false });
    }
    expect(runRandomGrayscaleColor({ unexpected: true })).toMatchObject({ error: { issues: [{ code: "unknown_field", field: "unexpected" }] }, ok: false });
  });
});
