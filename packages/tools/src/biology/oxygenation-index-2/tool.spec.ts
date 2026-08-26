import { describe, expect, it } from "vitest";
import {
  oxygenationIndexVariantExample,
  runOxygenationIndexVariant,
} from "./tool.js";

describe("OI Variant With PEEP", () => {
  it("publishes an executable example", () =>
    expect(
      runOxygenationIndexVariant(oxygenationIndexVariantExample.input),
    ).toEqual({ ok: true, output: oxygenationIndexVariantExample.output }));
  it("uses the percent number without a factor of one hundred", () =>
    expect(
      runOxygenationIndexVariant({
        fiO2PercentNumber: 100,
        meanAirwayPressureCmH2o: 10,
        paO2Mmhg: 50,
      }),
    ).toEqual({ ok: true, output: { oxygenationIndexVariant: 20 } }));
  it("accepts the lowest valid percent", () =>
    expect(
      runOxygenationIndexVariant({
        fiO2PercentNumber: 1,
        meanAirwayPressureCmH2o: 5,
        paO2Mmhg: 1,
      }),
    ).toEqual({ ok: true, output: { oxygenationIndexVariant: 5 } }));
  it("keeps fractional results", () =>
    expect(
      runOxygenationIndexVariant({
        fiO2PercentNumber: 60,
        meanAirwayPressureCmH2o: 14,
        paO2Mmhg: 64,
      }),
    ).toEqual({ ok: true, output: { oxygenationIndexVariant: 13.125 } }));
  it("rejects a percent above one hundred", () =>
    expect(
      runOxygenationIndexVariant({
        fiO2PercentNumber: 101,
        meanAirwayPressureCmH2o: 10,
        paO2Mmhg: 50,
      }).ok,
    ).toBe(false));
  it("rejects zero mean airway pressure", () =>
    expect(
      runOxygenationIndexVariant({
        fiO2PercentNumber: 40,
        meanAirwayPressureCmH2o: 0,
        paO2Mmhg: 50,
      }).ok,
    ).toBe(false));
  it("rejects zero arterial oxygen tension", () =>
    expect(
      runOxygenationIndexVariant({
        fiO2PercentNumber: 40,
        meanAirwayPressureCmH2o: 10,
        paO2Mmhg: 0,
      }).ok,
    ).toBe(false));
});
