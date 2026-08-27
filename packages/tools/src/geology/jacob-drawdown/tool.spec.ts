import { describe, expect, it } from "vitest";
import { jacobDrawdownExample, runJacobDrawdown } from "./tool.js";

describe("jacob-drawdown", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJacobDrawdown(jacobDrawdownExample.input)).toEqual({
      ok: true,
      output: jacobDrawdownExample.output,
    });
  });

  it("increases by one log-cycle slope when time multiplies by ten", () => {
    const early = runJacobDrawdown({
      dischargeM3PerDay: 500,
      transmissivityM2PerDay: 100,
      distanceToWellM: 30,
      storativity: 0.0002,
      elapsedDays: 1,
    });
    const late = runJacobDrawdown({
      dischargeM3PerDay: 500,
      transmissivityM2PerDay: 100,
      distanceToWellM: 30,
      storativity: 0.0002,
      elapsedDays: 10,
    });
    if (!early.ok || !late.ok) throw new Error("expected success");
    const slope =
      (late.output.drawdownM as number) - (early.output.drawdownM as number);
    expect(slope).toBeCloseTo(0.9162907318741551, 3);
  });

  it("rejects non-positive time", () => {
    expect(
      runJacobDrawdown({
        dischargeM3PerDay: 500,
        transmissivityM2PerDay: 100,
        distanceToWellM: 30,
        storativity: 0.0002,
        elapsedDays: 0,
      }).ok,
    ).toBe(false);
  });
});
