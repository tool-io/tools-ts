import { describe, expect, it } from "vitest";
import { kickToleranceExample, runKickTolerance } from "./tool.js";

describe("kick-tolerance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runKickTolerance(kickToleranceExample.input)).toEqual({
      ok: true,
      output: kickToleranceExample.output,
    });
  });

  it("scales kick volume linearly with annular capacity", () => {
    const doubled = runKickTolerance({
      ...kickToleranceExample.input,
      annularCapacityCubicMetresPerMetre: 0.06,
    });
    if (!doubled.ok) throw new Error("expected success");
    expect(doubled.output.maxKickVolumeCubicMetres).toBeCloseTo(
      44.408513610662154,
      9,
    );
  });

  it("rejects influx heavier than the mud", () => {
    expect(
      runKickTolerance({
        ...kickToleranceExample.input,
        influxDensityKgPerCubicMetre: 1500,
      }).ok,
    ).toBe(false);
  });
});
