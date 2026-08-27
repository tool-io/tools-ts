import { describe, expect, it } from "vitest";
import {
  calculateInductorTimeToCurrent,
  inductorTimeToCurrentExample,
  runInductorTimeToCurrent,
} from "./tool.js";

describe("RL Time To Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInductorTimeToCurrent(inductorTimeToCurrentExample.input),
    ).toEqual({
      ok: true,
      output: inductorTimeToCurrentExample.output,
    });
  });

  it("rejects unreachable steady-state current", () => {
    expect(
      runInductorTimeToCurrent({
        inductanceH: 0.01,
        resistanceOhms: 10,
        supplyVolts: 12,
        targetAmps: 2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unreachable_current" }] },
      ok: false,
    });
  });

  it("takes one time constant to reach 63.2 percent of steady state", () => {
    const tau = 0.01 / 10;
    const steadyState = 12 / 10;
    expect(
      calculateInductorTimeToCurrent({
        inductanceH: 0.01,
        resistanceOhms: 10,
        supplyVolts: 12,
        targetAmps: steadyState * (1 - Math.exp(-1)),
      }).timeSeconds,
    ).toBeCloseTo(tau, 15);
  });
});
