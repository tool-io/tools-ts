import { describe, expect, it } from "vitest";
import { barkDensityExample, runBarkDensity } from "./tool.js";

describe("Bark Density", () => {
  it("publishes an executable example", () =>
    expect(runBarkDensity(barkDensityExample.input)).toEqual({
      ok: true,
      output: barkDensityExample.output,
    }));
  it("doubles when mass doubles at fixed volume", () =>
    expect(runBarkDensity({ barkDryMassG: 90, barkVolumeCm3: 90 })).toEqual({
      ok: true,
      output: { barkDensityGCm3: 1 },
    }));
  it("doubles when volume halves at fixed mass", () =>
    expect(runBarkDensity({ barkDryMassG: 45, barkVolumeCm3: 45 })).toEqual({
      ok: true,
      output: { barkDensityGCm3: 1 },
    }));
  it("keeps fractional densities exact", () =>
    expect(runBarkDensity({ barkDryMassG: 30, barkVolumeCm3: 120 })).toEqual({
      ok: true,
      output: { barkDensityGCm3: 0.25 },
    }));
  it("rejects zero dry mass", () => {
    const result = runBarkDensity({ barkDryMassG: 0, barkVolumeCm3: 90 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("barkDryMassG");
  });
  it("rejects zero volume", () => {
    const result = runBarkDensity({ barkDryMassG: 45, barkVolumeCm3: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("barkVolumeCm3");
  });
  it("rejects negative volumes", () => {
    const result = runBarkDensity({ barkDryMassG: 45, barkVolumeCm3: -90 });
    expect(result.ok).toBe(false);
  });
});
