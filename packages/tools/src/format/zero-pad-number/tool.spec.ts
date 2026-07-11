import { describe, expect, it } from "vitest";
import { runZeroPadNumber } from "./tool.js";
describe("Zero-Pad Number Formatter", () => {
  it("calculates a valid result", () => {
    expect(runZeroPadNumber({ value: -42, width: 5 })).toEqual({
      ok: true,
      output: { formatted: "-00042" },
    });
  });
  it("rejects invalid input", () =>
    expect(runZeroPadNumber(null).ok).toBe(false));
});
