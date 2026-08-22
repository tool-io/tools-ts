import { describe, expect, it } from "vitest";
import { runNetFromGross } from "./tool.js";

describe("Net From Gross Calculator", () => {
  it("calculates a valid result", () => {
    expect(runNetFromGross({ gross: 120, ratePercent: 20 })).toEqual({
      ok: true,
      output: { net: 100, portion: 20 },
    });
  });

  it("returns the gross unchanged for a zero rate", () => {
    expect(runNetFromGross({ gross: 90, ratePercent: 0 })).toEqual({
      ok: true,
      output: { net: 90, portion: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runNetFromGross(null).ok).toBe(false));
});
