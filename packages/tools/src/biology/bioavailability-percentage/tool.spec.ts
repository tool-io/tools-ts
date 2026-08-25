import { describe, expect, it } from "vitest";
import { runBioavailabilityPercentage } from "./tool.js";

describe("Bioavailability %", () => {
  it("calculates a valid result", () =>
    expect(
      runBioavailabilityPercentage({
        aucIv: 100,
        aucOral: 50,
        doseIv: 100,
        doseOral: 50,
      }),
    ).toEqual({ ok: true, output: { bioavailabilityPercent: 100 } }));
  it("adjusts for differing doses", () =>
    expect(
      runBioavailabilityPercentage({
        aucIv: 100,
        aucOral: 90,
        doseIv: 200,
        doseOral: 100,
      }),
    ).toEqual({ ok: true, output: { bioavailabilityPercent: 180 } }));
  it("reports full absorption for equal exposure", () =>
    expect(
      runBioavailabilityPercentage({
        aucIv: 40,
        aucOral: 40,
        doseIv: 5,
        doseOral: 5,
      }),
    ).toEqual({ ok: true, output: { bioavailabilityPercent: 100 } }));
  it("reports low absorption for small oral AUC", () =>
    expect(
      runBioavailabilityPercentage({
        aucIv: 100,
        aucOral: 10,
        doseIv: 10,
        doseOral: 10,
      }),
    ).toEqual({ ok: true, output: { bioavailabilityPercent: 10 } }));
  it("scales linearly with the oral AUC", () =>
    expect(
      runBioavailabilityPercentage({
        aucIv: 25,
        aucOral: 12.5,
        doseIv: 4,
        doseOral: 2,
      }),
    ).toEqual({ ok: true, output: { bioavailabilityPercent: 100 } }));
  it("returns zero when there is no oral exposure", () =>
    expect(
      runBioavailabilityPercentage({
        aucIv: 100,
        aucOral: 0,
        doseIv: 100,
        doseOral: 50,
      }),
    ).toEqual({ ok: true, output: { bioavailabilityPercent: 0 } }));
  it("rejects non-positive AUC values", () => {
    const result = runBioavailabilityPercentage({
      aucIv: 0,
      aucOral: 50,
      doseIv: 100,
      doseOral: 50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_auc");
  });
  it("rejects non-positive doses", () => {
    const result = runBioavailabilityPercentage({
      aucIv: 100,
      aucOral: 50,
      doseIv: 100,
      doseOral: -50,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_dose");
  });
});
