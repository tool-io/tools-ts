import { describe, expect, it } from "vitest";
import { inrRatioExample, runInrRatio } from "./tool.js";

describe("INR Ratio", () => {
  it("publishes an executable example", () =>
    expect(runInrRatio(inrRatioExample.input)).toEqual({
      ok: true,
      output: inrRatioExample.output,
    }));
  it("returns one for matching times", () =>
    expect(
      runInrRatio({ meanNormalPtSeconds: 13.5, patientPtSeconds: 13.5 }),
    ).toEqual({ ok: true, output: { inr: 1 } }));
  it("computes a therapeutic ratio", () =>
    expect(
      runInrRatio({ meanNormalPtSeconds: 12, patientPtSeconds: 30 }),
    ).toEqual({ ok: true, output: { inr: 2.5 } }));
  it("keeps fractional precision", () =>
    expect(
      runInrRatio({ meanNormalPtSeconds: 12.3, patientPtSeconds: 24.6 }),
    ).toEqual({ ok: true, output: { inr: 2 } }));
  it("supports sub-unity ratios", () =>
    expect(
      runInrRatio({ meanNormalPtSeconds: 20, patientPtSeconds: 10 }),
    ).toEqual({ ok: true, output: { inr: 0.5 } }));
  it("applies the reagent ISI as an exponent", () =>
    expect(
      runInrRatio({
        isi: 1.2,
        meanNormalPtSeconds: 12,
        patientPtSeconds: 24,
      }),
    ).toEqual({ ok: true, output: { inr: Math.pow(2, 1.2) } }));
  it("rejects zero patient PT", () => {
    const result = runInrRatio({
      meanNormalPtSeconds: 12,
      patientPtSeconds: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("patientPtSeconds");
  });
  it("rejects negative mean normal PT", () => {
    const result = runInrRatio({
      meanNormalPtSeconds: -12,
      patientPtSeconds: 24,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("meanNormalPtSeconds");
  });
  it("rejects unknown fields", () => {
    const result = runInrRatio({
      extra: 1,
      meanNormalPtSeconds: 12,
      patientPtSeconds: 24,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a non-positive ISI", () =>
    expect(
      runInrRatio({ isi: 0, meanNormalPtSeconds: 12, patientPtSeconds: 24 }).ok,
    ).toBe(false));
});
