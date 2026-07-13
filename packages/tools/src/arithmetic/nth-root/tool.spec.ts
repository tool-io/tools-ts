import { describe, expect, it } from "vitest";
import { runNthRoot } from "./tool.js";

describe("Nth Root Calculator", () => {
  it("calculates square and odd roots", () => {
    expect(runNthRoot({ value: 81, degree: 2 })).toEqual({
      ok: true,
      output: { root: 9 },
    });
    expect(runNthRoot({ value: -27, degree: 3 })).toEqual({
      ok: true,
      output: { root: -3 },
    });
  });

  it("rejects zero degrees and non-real roots", () => {
    expect(runNthRoot({ value: 4, degree: 0 }).ok).toBe(false);
    expect(runNthRoot({ value: -4, degree: 2 }).ok).toBe(false);
  });
});
