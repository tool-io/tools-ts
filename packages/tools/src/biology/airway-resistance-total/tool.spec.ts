import { describe, expect, it } from "vitest";
import {
  airwayResistanceTotalExample,
  runAirwayResistanceTotal,
} from "./tool.js";

describe("Total Airway Resistance", () => {
  it("publishes an executable example", () =>
    expect(
      runAirwayResistanceTotal(airwayResistanceTotalExample.input),
    ).toEqual({
      ok: true,
      output: airwayResistanceTotalExample.output,
    }));
  it("equals zero for equal peak and plateau pressures", () =>
    expect(
      runAirwayResistanceTotal({
        inspiratoryFlowLs: 1,
        peakInspiratoryPressureCmH2o: 20,
        pausePlateauCmH2o: 20,
      }),
    ).toEqual({ ok: true, output: { totalAirwayResistance: 0 } }));
  it("halves resistance when flow doubles", () =>
    expect(
      runAirwayResistanceTotal({
        inspiratoryFlowLs: 2,
        peakInspiratoryPressureCmH2o: 30,
        pausePlateauCmH2o: 10,
      }),
    ).toEqual({ ok: true, output: { totalAirwayResistance: 10 } }));
  it("keeps fractional resistance", () =>
    expect(
      runAirwayResistanceTotal({
        inspiratoryFlowLs: 0.8,
        peakInspiratoryPressureCmH2o: 26,
        pausePlateauCmH2o: 10,
      }),
    ).toEqual({ ok: true, output: { totalAirwayResistance: 20 } }));
  it("rejects peak below plateau", () => {
    const result = runAirwayResistanceTotal({
      inspiratoryFlowLs: 1,
      peakInspiratoryPressureCmH2o: 5,
      pausePlateauCmH2o: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_difference");
  });
  it("rejects zero flow", () =>
    expect(
      runAirwayResistanceTotal({
        inspiratoryFlowLs: 0,
        peakInspiratoryPressureCmH2o: 30,
        pausePlateauCmH2o: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative flow", () =>
    expect(
      runAirwayResistanceTotal({
        inspiratoryFlowLs: -1,
        peakInspiratoryPressureCmH2o: 30,
        pausePlateauCmH2o: 10,
      }).ok,
    ).toBe(false));
});
