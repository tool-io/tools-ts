import { describe, expect, it } from "vitest";
import { runComplement } from "./tool.js";
describe("Probability Complement Calculator", () => {
  it("calculates a valid result", () => {
    expect(runComplement({ probability: 0.3 })).toEqual({
      ok: true,
      output: { complement: 0.7 },
    });
  });
  it("rejects invalid input", () => expect(runComplement(null).ok).toBe(false));
});
