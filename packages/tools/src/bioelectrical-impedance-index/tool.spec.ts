import { describe, expect, it } from "vitest";
import {
  bioelectricalImpedanceIndexTool,
  calculateBioelectricalImpedanceIndex,
} from "./tool.js";

describe("bioelectrical impedance index", () => {
  it("calculates height squared divided by resistance", () => {
    expect(
      calculateBioelectricalImpedanceIndex({
        heightCm: 180,
        resistanceOhms: 500,
      }),
    ).toEqual({ ok: true, output: { impedanceIndexCm2PerOhm: 64.8 } });
  });

  it("rejects missing and nonpositive measurements", () => {
    expect(
      calculateBioelectricalImpedanceIndex({ heightCm: 180 }),
    ).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes a pure tool contract", () => {
    expect(bioelectricalImpedanceIndexTool.execution).toEqual({ kind: "pure" });
  });
});
