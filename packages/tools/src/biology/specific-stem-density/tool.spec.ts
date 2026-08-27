import { describe, expect, it } from "vitest";
import { runSpecificStemDensity, specificStemDensityExample } from "./tool.js";

describe("Stem Wood Density", () => {
  it("publishes an executable example", () =>
    expect(runSpecificStemDensity(specificStemDensityExample.input)).toEqual({
      ok: true,
      output: specificStemDensityExample.output,
    }));
  it("doubles when mass doubles at fixed volume", () =>
    expect(
      runSpecificStemDensity({ stemDryMassG: 300, stemVolumeCm3: 200 }),
    ).toEqual({ ok: true, output: { stemDensityGCm3: 1.5 } }));
  it("doubles when volume halves at fixed mass", () =>
    expect(
      runSpecificStemDensity({ stemDryMassG: 150, stemVolumeCm3: 100 }),
    ).toEqual({ ok: true, output: { stemDensityGCm3: 1.5 } }));
  it("keeps fractional densities exact", () =>
    expect(
      runSpecificStemDensity({ stemDryMassG: 100, stemVolumeCm3: 400 }),
    ).toEqual({ ok: true, output: { stemDensityGCm3: 0.25 } }));
  it("rejects zero dry mass", () => {
    const result = runSpecificStemDensity({
      stemDryMassG: 0,
      stemVolumeCm3: 200,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("stemDryMassG");
  });
  it("rejects zero volume", () => {
    const result = runSpecificStemDensity({
      stemDryMassG: 150,
      stemVolumeCm3: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("stemVolumeCm3");
  });
  it("rejects negative masses", () => {
    const result = runSpecificStemDensity({
      stemDryMassG: -150,
      stemVolumeCm3: 200,
    });
    expect(result.ok).toBe(false);
  });
});
