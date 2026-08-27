import { describe, expect, it } from "vitest";
import { runWoodRayProportion, woodRayProportionExample } from "./tool.js";

describe("Ray Proportion Percent", () => {
  it("publishes an executable example", () =>
    expect(runWoodRayProportion(woodRayProportionExample.input)).toEqual({
      ok: true,
      output: woodRayProportionExample.output,
    }));
  it("returns zero when no rays are measured", () =>
    expect(
      runWoodRayProportion({ rayAreaPixels: 0, totalSectionPixels: 800 }),
    ).toEqual({ ok: true, output: { woodRayProportionPercent: 0 } }));
  it("returns one hundred for an all-ray section", () =>
    expect(
      runWoodRayProportion({ rayAreaPixels: 500, totalSectionPixels: 500 }),
    ).toEqual({ ok: true, output: { woodRayProportionPercent: 100 } }));
  it("keeps fractional proportions exact", () =>
    expect(
      runWoodRayProportion({ rayAreaPixels: 125, totalSectionPixels: 1000 }),
    ).toEqual({ ok: true, output: { woodRayProportionPercent: 12.5 } }));
  it("rises with the ray fraction of the section", () => {
    const sparse = runWoodRayProportion({
      rayAreaPixels: 100,
      totalSectionPixels: 1000,
    });
    const dense = runWoodRayProportion({
      rayAreaPixels: 400,
      totalSectionPixels: 1000,
    });
    if (!sparse.ok || !dense.ok) throw new Error("expected success");
    expect(dense.output.woodRayProportionPercent as number).toBeGreaterThan(
      sparse.output.woodRayProportionPercent as number,
    );
  });
  it("rejects ray areas above the section with invalid_counts", () => {
    const result = runWoodRayProportion({
      rayAreaPixels: 1200,
      totalSectionPixels: 1000,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects an empty section", () => {
    const result = runWoodRayProportion({
      rayAreaPixels: 250,
      totalSectionPixels: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative ray areas", () => {
    const result = runWoodRayProportion({
      rayAreaPixels: -10,
      totalSectionPixels: 1000,
    });
    expect(result.ok).toBe(false);
  });
});
