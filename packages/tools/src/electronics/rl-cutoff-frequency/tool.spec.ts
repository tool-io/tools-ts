import { describe, expect, it } from "vitest";
import {
  calculateRlCutoffFrequency,
  rlCutoffFrequencyExample,
  runRlCutoffFrequency,
} from "./tool.js";

describe("RL Cutoff Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRlCutoffFrequency(rlCutoffFrequencyExample.input)).toEqual({
      ok: true,
      output: rlCutoffFrequencyExample.output,
    });
  });

  it("rejects non-positive inductance", () => {
    expect(
      runRlCutoffFrequency({ inductanceH: 0, resistanceOhms: 1000 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_inductance" }] },
      ok: false,
    });
  });

  it("doubles cutoff when resistance doubles", () => {
    expect(
      calculateRlCutoffFrequency({ inductanceH: 0.01, resistanceOhms: 2000 })
        .cutoffFrequencyHz,
    ).toBeCloseTo(rlCutoffFrequencyExample.output.cutoffFrequencyHz * 2, 12);
  });
});
