import { describe, expect, it } from "vitest";
import { runPercentAnalyteGravimetry } from "./tool.js";
describe("Percent Analyte Gravimetry", () => {
  it("calculates a valid result", () =>
    expect(
      runPercentAnalyteGravimetry({
        gravimetricFactor: 0.4,
        precipitateMassG: 0.5,
        sampleMassG: 2,
      }),
    ).toEqual({
      ok: true,
      output: { percentAnalyte: 10 },
    }));
  it("rejects invalid input", () =>
    expect(
      runPercentAnalyteGravimetry({
        gravimetricFactor: 0.4,
        precipitateMassG: 0.5,
        sampleMassG: 0,
      }).ok,
    ).toBe(false));
});
