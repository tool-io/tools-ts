import { describe, expect, it } from "vitest";
import { runTrailingZeros } from "./tool.js";

describe("Trailing Zeros Counter", () => {
  it("calculates a valid result", () => {
    expect(runTrailingZeros({ value: 1200 })).toEqual({
      ok: true,
      output: { zeros: 2 },
    });
    expect(runTrailingZeros({ value: 7 })).toEqual({
      ok: true,
      output: { zeros: 0 },
    });
    expect(runTrailingZeros({ value: 100000 })).toEqual({
      ok: true,
      output: { zeros: 5 },
    });
  });

  it("rejects invalid input", () =>
    expect(runTrailingZeros(null).ok).toBe(false));
});
