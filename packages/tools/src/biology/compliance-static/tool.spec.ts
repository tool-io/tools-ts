import { describe, expect, it } from "vitest";
import { complianceStaticExample, runComplianceStatic } from "./tool.js";

describe("Static Compliance", () => {
  it("publishes an executable example", () =>
    expect(runComplianceStatic(complianceStaticExample.input)).toEqual({
      ok: true,
      output: complianceStaticExample.output,
    }));
  it("computes a stiff lung", () =>
    expect(
      runComplianceStatic({
        peepCmh2o: 10,
        plateauPressureCmh2o: 35,
        tidalVolumeMl: 250,
      }),
    ).toEqual({ ok: true, output: { staticComplianceMlPerCmH2o: 10 } }));
  it("computes a compliant lung", () =>
    expect(
      runComplianceStatic({
        peepCmh2o: 0,
        plateauPressureCmh2o: 10,
        tidalVolumeMl: 600,
      }),
    ).toEqual({ ok: true, output: { staticComplianceMlPerCmH2o: 60 } }));
  it("keeps fractional precision", () =>
    expect(
      runComplianceStatic({
        peepCmh2o: 5,
        plateauPressureCmh2o: 30,
        tidalVolumeMl: 420,
      }),
    ).toEqual({ ok: true, output: { staticComplianceMlPerCmH2o: 16.8 } }));
  it("rejects zero tidal volume", () => {
    const result = runComplianceStatic({
      peepCmh2o: 5,
      plateauPressureCmh2o: 25,
      tidalVolumeMl: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("tidalVolumeMl");
  });
  it("rejects plateau pressure equal to PEEP", () => {
    const result = runComplianceStatic({
      peepCmh2o: 5,
      plateauPressureCmh2o: 5,
      tidalVolumeMl: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_pressure");
  });
  it("rejects plateau pressure below PEEP", () => {
    const result = runComplianceStatic({
      peepCmh2o: 8,
      plateauPressureCmh2o: 5,
      tidalVolumeMl: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_pressure");
  });
});
