import { describe, expect, it } from "vitest";
import { runSurfaceAreaToVolumeRatio } from "./tool.js";

describe("SA/V Ratio", () => {
  it("calculates a valid result", () =>
    expect(runSurfaceAreaToVolumeRatio({ sideLengthMm: 2 })).toEqual({
      ok: true,
      output: { saVolumeRatio: 3 },
    }));
  it("gives six for a unit cube", () => {
    const result = runSurfaceAreaToVolumeRatio({ sideLengthMm: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.saVolumeRatio).toBe(6);
  });
  it("scales inversely with side length", () => {
    const result = runSurfaceAreaToVolumeRatio({ sideLengthMm: 0.5 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.saVolumeRatio).toBe(12);
  });
  it("accepts fractional side lengths", () => {
    const result = runSurfaceAreaToVolumeRatio({ sideLengthMm: 4 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.saVolumeRatio).toBe(1.5);
  });
  it("rejects zero side length", () =>
    expect(runSurfaceAreaToVolumeRatio({ sideLengthMm: 0 }).ok).toBe(false));
  it("rejects negative side length", () =>
    expect(runSurfaceAreaToVolumeRatio({ sideLengthMm: -2 }).ok).toBe(false));
});
