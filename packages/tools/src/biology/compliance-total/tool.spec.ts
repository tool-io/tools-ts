import { describe, expect, it } from "vitest";
import { complianceTotalExample, runComplianceTotal } from "./tool.js";

describe("Total Compliance", () => {
  it("publishes an executable example", () =>
    expect(runComplianceTotal(complianceTotalExample.input)).toEqual({
      ok: true,
      output: complianceTotalExample.output,
    }));
  it("halves compliance when driving pressure doubles", () =>
    expect(
      runComplianceTotal({
        exhaledTidalVolumeMl: 500,
        plateauPressureCmH2o: 30,
        totalPeepCmH2o: 5,
      }),
    ).toEqual({ ok: true, output: { totalComplianceMlPerCmh2o: 20 } }));
  it("supports zero PEEP", () =>
    expect(
      runComplianceTotal({
        exhaledTidalVolumeMl: 400,
        plateauPressureCmH2o: 20,
        totalPeepCmH2o: 0,
      }),
    ).toEqual({ ok: true, output: { totalComplianceMlPerCmh2o: 20 } }));
  it("keeps fractional compliance", () =>
    expect(
      runComplianceTotal({
        exhaledTidalVolumeMl: 300,
        plateauPressureCmH2o: 22,
        totalPeepCmH2o: 8,
      }),
    ).toEqual({
      ok: true,
      output: { totalComplianceMlPerCmh2o: 21.428571428571427 },
    }));
  it("rejects plateau pressure at or below PEEP", () => {
    const result = runComplianceTotal({
      exhaledTidalVolumeMl: 500,
      plateauPressureCmH2o: 5,
      totalPeepCmH2o: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_pressure");
  });
  it("rejects zero tidal volume", () =>
    expect(
      runComplianceTotal({
        exhaledTidalVolumeMl: 0,
        plateauPressureCmH2o: 25,
        totalPeepCmH2o: 5,
      }).ok,
    ).toBe(false));
  it("rejects negative tidal volume", () =>
    expect(
      runComplianceTotal({
        exhaledTidalVolumeMl: -500,
        plateauPressureCmH2o: 25,
        totalPeepCmH2o: 5,
      }).ok,
    ).toBe(false));
});
