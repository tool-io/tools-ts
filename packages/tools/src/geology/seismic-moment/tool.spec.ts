import { describe, expect, it } from "vitest";
import { seismicMomentExample, runSeismicMoment } from "./tool.js";

describe("seismic-moment", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeismicMoment(seismicMomentExample.input)).toEqual({
      ok: true,
      output: seismicMomentExample.output,
    });
  });

  it("applies the supplied rigidity", () => {
    const result = runSeismicMoment({
      ruptureAreaSquareMeters: 1,
      averageSlipMeters: 1,
      shearModulusPa: 5e9,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.seismicMomentNewtonMeters as number).toBe(5e9);
  });
  it("rejects non-positive area", () => {
    expect(
      runSeismicMoment({ ruptureAreaSquareMeters: 0, averageSlipMeters: 1 }).ok,
    ).toBe(false);
  });
});
