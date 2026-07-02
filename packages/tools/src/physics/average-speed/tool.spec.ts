import { describe, expect, it } from "vitest";
import { runAverageSpeed } from "./tool.js";
describe("Average Speed Calculator", () => {
  it("calculates a valid result", () => {
    expect(runAverageSpeed({ distance: 150, time: 3 })).toEqual({
      ok: true,
      output: { speed: 50 },
    });
  });
  it("rejects invalid input", () =>
    expect(runAverageSpeed(null).ok).toBe(false));
});
