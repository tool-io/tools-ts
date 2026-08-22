import { describe, expect, it } from "vitest";
import { runSpeedToPace } from "./tool.js";

describe("Speed to Pace Converter", () => {
  it("calculates a valid result", () => {
    expect(runSpeedToPace({ speedKmh: 12 })).toEqual({
      ok: true,
      output: { paceFormatted: "05:00 /km", paceSecondsPerKm: 300 },
    });
  });

  it("rejects invalid input", () =>
    expect(runSpeedToPace(null).ok).toBe(false));
});
