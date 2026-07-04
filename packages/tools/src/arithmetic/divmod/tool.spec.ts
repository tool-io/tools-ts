import { describe, expect, it } from "vitest";
import { runDivmod } from "./tool.js";
describe("Division with Remainder Calculator", () => {
  it("calculates a valid result", () =>
    expect(runDivmod({ dividend: 17, divisor: 5 })).toEqual({
      ok: true,
      output: { quotient: 3, remainder: 2 },
    }));
  it("rejects invalid input", () =>
    expect(runDivmod({ dividend: 1, divisor: 0 }).ok).toBe(false));
});
