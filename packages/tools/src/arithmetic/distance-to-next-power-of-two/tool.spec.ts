import { describe, expect, it } from "vitest";
import { runDistanceToNextPowerOfTwo } from "./tool.js";

describe("Distance to Next Power of Two Calculator", () => {
  it("calculates a valid result", () => {
    expect(runDistanceToNextPowerOfTwo({ value: 9 })).toEqual({
      ok: true,
      output: { distance: 7 },
    });
    expect(runDistanceToNextPowerOfTwo({ value: 8 })).toEqual({
      ok: true,
      output: { distance: 0 },
    });
    expect(runDistanceToNextPowerOfTwo({ value: 0 })).toEqual({
      ok: true,
      output: { distance: 1 },
    });
  });

  it("rejects invalid input", () =>
    expect(runDistanceToNextPowerOfTwo(null).ok).toBe(false));
});
