import { describe, expect, it } from "vitest";
import { correctedAltitudeExample, runCorrectedAltitude } from "./tool.js";

describe("corrected altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCorrectedAltitude(correctedAltitudeExample.input)).toEqual({
      ok: true,
      output: correctedAltitudeExample.output,
    });
  });

  it("shows no correction at ISA temperature", () => {
    expect(
      runCorrectedAltitude({
        isaTemperatureC: 15,
        oatC: 15,
        trueAltitudeFt: 4000,
      }),
    ).toEqual({
      ok: true,
      output: { correctionFt: 0, indicatedAltitudeFt: 4000 },
    });
  });

  it("indicates higher than true in cold air", () => {
    const result = runCorrectedAltitude({
      isaTemperatureC: 15,
      oatC: -15,
      trueAltitudeFt: 3000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.indicatedAltitudeFt).toBeGreaterThan(3000);
  });
});
