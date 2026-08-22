import { describe, expect, it } from "vitest";
import { runQuarterOfYear } from "./tool.js";

describe("Quarter of Year Calculator", () => {
  it("calculates a valid result", () => {
    expect(runQuarterOfYear({ date: "2024-01-15" })).toEqual({
      ok: true,
      output: { quarter: 1 },
    });
    expect(runQuarterOfYear({ date: "2024-06-30" })).toEqual({
      ok: true,
      output: { quarter: 2 },
    });
    expect(runQuarterOfYear({ date: "2024-12-31" })).toEqual({
      ok: true,
      output: { quarter: 4 },
    });
  });

  it("rejects invalid input", () =>
    expect(runQuarterOfYear(null).ok).toBe(false));
});
