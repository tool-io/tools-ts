import { describe, expect, it } from "vitest";
import {
  ndYagThresholdInversionExample as example,
  runNdYagThresholdInversion,
} from "./tool.js";
describe("Nd:YAG threshold inversion", () => {
  it("solves the round-trip gain condition", () =>
    expect(runNdYagThresholdInversion(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects zero wavelength and invalid reflectivity", () => {
    expect(
      runNdYagThresholdInversion({ lambdaNm: 0, rodLengthMm: 100 }).ok,
    ).toBe(false);
    expect(
      runNdYagThresholdInversion({ outputR: 1.1, rodLengthMm: 100 }).ok,
    ).toBe(false);
  });
});
