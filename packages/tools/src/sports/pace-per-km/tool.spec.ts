import { describe, expect, it } from "vitest";
import { runPacePerKm } from "./tool.js";

describe("Pace Per Kilometer Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPacePerKm({ distanceKm: 10, minutes: 50 })).toEqual({
      ok: true,
      output: { paceFormatted: "05:00 /km", paceSecondsPerKm: 300 },
    });
  });

  it("rejects invalid input", () => expect(runPacePerKm(null).ok).toBe(false));
});
