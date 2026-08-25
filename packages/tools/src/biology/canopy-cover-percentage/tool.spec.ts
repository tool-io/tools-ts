import { describe, expect, it } from "vitest";
import { runCanopyCoverPercentage } from "./tool.js";

describe("Canopy Cover %", () => {
  it("calculates a valid result", () =>
    expect(
      runCanopyCoverPercentage({ canopyAreaM2: 40, totalAreaM2: 100 }),
    ).toEqual({
      ok: true,
      output: { canopyCoverPercent: 40 },
    }));
  it("reaches one hundred percent under full closure", () => {
    const result = runCanopyCoverPercentage({
      canopyAreaM2: 100,
      totalAreaM2: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.canopyCoverPercent).toBe(100);
  });
  it("returns zero for open plots", () => {
    const result = runCanopyCoverPercentage({
      canopyAreaM2: 0,
      totalAreaM2: 50,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.canopyCoverPercent).toBe(0);
  });
  it("supports fractional cover", () => {
    const result = runCanopyCoverPercentage({
      canopyAreaM2: 12.5,
      totalAreaM2: 100,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.canopyCoverPercent).toBeCloseTo(12.5, 12);
  });
  it("rejects canopy exceeding total area", () =>
    expect(
      runCanopyCoverPercentage({ canopyAreaM2: 101, totalAreaM2: 100 }).ok,
    ).toBe(false));
  it("rejects zero total area", () =>
    expect(
      runCanopyCoverPercentage({ canopyAreaM2: 40, totalAreaM2: 0 }).ok,
    ).toBe(false));
  it("rejects negative canopy area", () =>
    expect(
      runCanopyCoverPercentage({ canopyAreaM2: -4, totalAreaM2: 100 }).ok,
    ).toBe(false));
});
