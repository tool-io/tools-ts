import { describe, expect, it } from "vitest";
import { runTotalMoment } from "./tool.js";
describe("Total Moment Calculator", () => {
  it("calculates a valid result", () =>
    expect(runTotalMoment({ armCm: 120, weightKg: 75 })).toEqual({
      ok: true,
      output: { momentKgCm: 9000 },
    }));
  it("supports negative arms", () =>
    expect(runTotalMoment({ armCm: -40, weightKg: 80 })).toEqual({
      ok: true,
      output: { momentKgCm: -3200 },
    }));
  it("handles fractional values", () =>
    expect(runTotalMoment({ armCm: 98.4, weightKg: 62.5 })).toEqual({
      ok: true,
      output: { momentKgCm: 6150 },
    }));
  it("returns zero moment at the datum", () =>
    expect(runTotalMoment({ armCm: 0, weightKg: 50 })).toEqual({
      ok: true,
      output: { momentKgCm: 0 },
    }));
  it("rejects zero weight", () =>
    expect(runTotalMoment({ armCm: 100, weightKg: 0 }).ok).toBe(false));
  it("rejects negative weight", () =>
    expect(runTotalMoment({ armCm: 100, weightKg: -5 }).ok).toBe(false));
  it("rejects non-finite weight", () =>
    expect(runTotalMoment({ armCm: 100, weightKg: Number.NaN }).ok).toBe(
      false,
    ));
});
