import { describe, expect, it } from "vitest";
import { runModulo } from "./tool.js";
describe("Positive Modulo Calculator", () => {
  it("calculates a valid result", () =>
    expect(runModulo({ dividend: -3, modulus: 5 })).toEqual({
      ok: true,
      output: { remainder: 2 },
    }));
  it("rejects invalid input", () =>
    expect(runModulo({ dividend: 1, modulus: 0 }).ok).toBe(false));
});
