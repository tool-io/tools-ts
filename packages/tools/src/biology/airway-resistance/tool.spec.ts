import { describe, expect, it } from "vitest";
import { airwayResistanceExample, runAirwayResistance } from "./tool.js";

describe("Airway Resistance", () => {
  it("publishes an executable example", () =>
    expect(runAirwayResistance(airwayResistanceExample.input)).toEqual({
      ok: true,
      output: airwayResistanceExample.output,
    }));
  it("computes elevated resistance at low flow", () =>
    expect(
      runAirwayResistance({
        flowLPerSecond: 0.25,
        peakPressureCmh2o: 35,
        plateauPressureCmh2o: 15,
      }),
    ).toEqual({ ok: true, output: { airwayResistanceCmh2oLPerS: 80 } }));
  it("returns zero for equal pressures", () =>
    expect(
      runAirwayResistance({
        flowLPerSecond: 1,
        peakPressureCmh2o: 25,
        plateauPressureCmh2o: 25,
      }),
    ).toEqual({ ok: true, output: { airwayResistanceCmh2oLPerS: 0 } }));
  it("keeps fractional precision", () =>
    expect(
      runAirwayResistance({
        flowLPerSecond: 0.6,
        peakPressureCmh2o: 31,
        plateauPressureCmh2o: 20,
      }),
    ).toEqual({
      ok: true,
      output: { airwayResistanceCmh2oLPerS: 18.333333333333336 },
    }));
  it("rejects zero flow", () => {
    const result = runAirwayResistance({
      flowLPerSecond: 0,
      peakPressureCmh2o: 30,
      plateauPressureCmh2o: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("flowLPerSecond");
  });
  it("rejects negative flow", () => {
    const result = runAirwayResistance({
      flowLPerSecond: -1,
      peakPressureCmh2o: 30,
      plateauPressureCmh2o: 20,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects peak below plateau", () => {
    const result = runAirwayResistance({
      flowLPerSecond: 1,
      peakPressureCmh2o: 19,
      plateauPressureCmh2o: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_difference");
  });
});
