import { describe, expect, it } from "vitest";
import { altimeterCorrectionExample, runAltimeterCorrection } from "./tool.js";

describe("altimeter correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAltimeterCorrection(altimeterCorrectionExample.input)).toEqual({
      ok: true,
      output: altimeterCorrectionExample.output,
    });
  });

  it("applies no correction at ISA temperature", () => {
    expect(
      runAltimeterCorrection({
        indicatedAltitudeFt: 4000,
        isaTemperatureC: 15,
        oatC: 15,
      }),
    ).toEqual({
      ok: true,
      output: { correctionFt: 0, correctedAltitudeFt: 4000 },
    });
  });

  it("adds correction in cold air and removes it in warm air", () => {
    const cold = runAltimeterCorrection({
      indicatedAltitudeFt: 2000,
      isaTemperatureC: 15,
      oatC: -15,
    });
    if (!cold.ok) throw new Error("expected success");
    expect(cold.output.correctionFt).toBeGreaterThan(0);
    const warm = runAltimeterCorrection({
      indicatedAltitudeFt: 2000,
      isaTemperatureC: 15,
      oatC: 35,
    });
    if (!warm.ok) throw new Error("expected success");
    expect(warm.output.correctionFt).toBeLessThan(0);
  });
});
