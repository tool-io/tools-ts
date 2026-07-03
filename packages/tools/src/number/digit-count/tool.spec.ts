import { describe, expect, it } from "vitest";
import { runDigitCount } from "./tool.js";
describe("Digit Count Calculator", () => {
  it("calculates a valid result", () =>
    expect(runDigitCount({ value: -1204 })).toEqual({
      ok: true,
      output: { digits: 4 },
    }));
  it("rejects invalid input", () => expect(runDigitCount(null).ok).toBe(false));
});
