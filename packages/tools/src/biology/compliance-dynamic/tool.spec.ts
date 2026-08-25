import { describe, expect, it } from "vitest";
import { complianceDynamicExample, runComplianceDynamic } from "./tool.js";

describe("Dynamic Compliance", () => {
  it("publishes an executable example", () =>
    expect(runComplianceDynamic(complianceDynamicExample.input)).toEqual({
      ok: true,
      output: complianceDynamicExample.output,
    }));
  it("sits below static compliance for the same breath", () =>
    expect(
      runComplianceDynamic({
        peakPressureCmh2o: 35,
        peepCmh2o: 5,
        tidalVolumeMl: 500,
      }),
    ).toEqual({
      ok: true,
      output: { dynamicComplianceMlPerCmH2o: 16.666666666666668 },
    }));
  it("handles zero PEEP", () =>
    expect(
      runComplianceDynamic({
        peakPressureCmh2o: 20,
        peepCmh2o: 0,
        tidalVolumeMl: 400,
      }),
    ).toEqual({ ok: true, output: { dynamicComplianceMlPerCmH2o: 20 } }));
  it("keeps fractional precision", () =>
    expect(
      runComplianceDynamic({
        peakPressureCmh2o: 22,
        peepCmh2o: 4,
        tidalVolumeMl: 450,
      }),
    ).toEqual({ ok: true, output: { dynamicComplianceMlPerCmH2o: 25 } }));
  it("rejects zero tidal volume", () => {
    const result = runComplianceDynamic({
      peakPressureCmh2o: 30,
      peepCmh2o: 5,
      tidalVolumeMl: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects peak pressure equal to PEEP", () => {
    const result = runComplianceDynamic({
      peakPressureCmh2o: 5,
      peepCmh2o: 5,
      tidalVolumeMl: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_pressure");
  });
  it("rejects peak pressure below PEEP", () => {
    const result = runComplianceDynamic({
      peakPressureCmh2o: 3,
      peepCmh2o: 5,
      tidalVolumeMl: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_pressure");
  });
});
