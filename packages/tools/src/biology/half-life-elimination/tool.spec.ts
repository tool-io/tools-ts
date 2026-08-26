import { describe, expect, it } from "vitest";
import { runHalfLifeElimination } from "./tool.js";

describe("Elimination Half-Life", () => {
  it("calculates a valid result", () =>
    expect(
      runHalfLifeElimination({ clearanceLPerH: 7, volumeDistributionL: 70 }),
    ).toEqual({
      ok: true,
      output: { eliminationHalfLifeHours: 6.93 },
    }));
  it("applies the natural log of two as 0.693", () => {
    const result = runHalfLifeElimination({
      clearanceLPerH: 10,
      volumeDistributionL: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.eliminationHalfLifeHours).toBeCloseTo(0.693, 12);
  });
  it("grows linearly with the volume of distribution", () => {
    const result = runHalfLifeElimination({
      clearanceLPerH: 7,
      volumeDistributionL: 140,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.eliminationHalfLifeHours).toBeCloseTo(13.86, 12);
  });
  it("shrinks with increasing clearance", () => {
    const result = runHalfLifeElimination({
      clearanceLPerH: 14,
      volumeDistributionL: 70,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.eliminationHalfLifeHours).toBeCloseTo(3.465, 12);
  });
  it("rejects a zero volume", () => {
    const result = runHalfLifeElimination({
      clearanceLPerH: 7,
      volumeDistributionL: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_volume");
  });
  it("rejects a zero clearance", () => {
    const result = runHalfLifeElimination({
      clearanceLPerH: 0,
      volumeDistributionL: 70,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_clearance");
  });
  it("rejects negative inputs", () =>
    expect(
      runHalfLifeElimination({ clearanceLPerH: -1, volumeDistributionL: 70 })
        .ok,
    ).toBe(false));
});
