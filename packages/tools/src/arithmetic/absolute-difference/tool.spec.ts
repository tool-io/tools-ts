import { describe, expect, it } from "vitest";
import { runAbsoluteDifference } from "./tool.js";
describe("Absolute Difference Calculator", () => {
  it("calculates a valid result", () =>
    expect(runAbsoluteDifference({ first: 9, second: 4 })).toEqual({
      ok: true,
      output: { difference: 5 },
    }));
  it("rejects invalid input", () =>
    expect(runAbsoluteDifference(null).ok).toBe(false));
});
