import { describe, expect, it } from "vitest";
import { runDivideTwoNumbers } from "./tool.js";

describe("Divide Two Numbers Calculator", () => {
  it("divides the first value by the second", () =>
    expect(runDivideTwoNumbers({ dividend: 7, divisor: 2 })).toEqual({
      ok: true,
      output: { quotient: 3.5 },
    }));

  it("rejects division by zero", () => {
    const result = runDivideTwoNumbers({ dividend: 7, divisor: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("division_by_zero");
  });
});
