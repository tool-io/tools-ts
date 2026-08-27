import { describe, expect, it } from "vitest";
import { theisDrawdownExample, runTheisDrawdown } from "./tool.js";

describe("theis-drawdown", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTheisDrawdown(theisDrawdownExample.input)).toEqual({
      ok: true,
      output: theisDrawdownExample.output,
    });
  });

  it("matches W(1) = 0.21938393439552027 for u equal to one", () => {
    const result = runTheisDrawdown({
      dischargeM3PerDay: Math.PI * 4,
      transmissivityM2PerDay: 1,
      distanceToWellM: 2,
      storativity: 1,
      elapsedDays: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.wellFunctionW as number).toBeCloseTo(
      0.21938393439552027,
      12,
    );
  });

  it("rejects non-positive storativity", () => {
    expect(
      runTheisDrawdown({
        dischargeM3PerDay: 500,
        transmissivityM2PerDay: 100,
        distanceToWellM: 30,
        storativity: 0,
        elapsedDays: 1,
      }).ok,
    ).toBe(false);
  });
});
