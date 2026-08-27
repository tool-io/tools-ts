import { describe, expect, it } from "vitest";
import { runSedimentationRate, sedimentationRateExample } from "./tool.js";

describe("sedimentation-rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSedimentationRate(sedimentationRateExample.input)).toEqual({
      ok: true,
      output: sedimentationRateExample.output,
    });
  });

  it("converts m/Myr to cm/kyr consistently", () => {
    const result = runSedimentationRate({
      sedimentThicknessM: 3,
      durationMillionYears: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.sedimentationRateCmPerKyr as number).toBe(
      0.15000000000000002,
    );
  });

  it("rejects negative thickness and non-positive durations", () => {
    expect(
      runSedimentationRate({ sedimentThicknessM: -1, durationMillionYears: 1 })
        .ok,
    ).toBe(false);
    expect(
      runSedimentationRate({ sedimentThicknessM: 1, durationMillionYears: -1 })
        .ok,
    ).toBe(false);
  });
});
