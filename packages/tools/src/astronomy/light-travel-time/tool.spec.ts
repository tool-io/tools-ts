import { describe, expect, it } from "vitest";
import { runLightTravelTime } from "./tool.js";

describe("Light Travel Time Calculator", () => {
  it("calculates a valid result", () => {
    expect(runLightTravelTime({ distanceKm: 299792.458 })).toMatchObject({
      ok: true,
      output: {
        seconds: expect.closeTo(1, 12),
        days: expect.closeTo(1 / 86400, 15),
      },
    });
  });

  it("handles moon distance in days", () => {
    const result = runLightTravelTime({ distanceKm: 384400 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.seconds).toBeCloseTo(1.2822, 3);
  });

  it("rejects invalid input", () =>
    expect(runLightTravelTime(null).ok).toBe(false));
});
