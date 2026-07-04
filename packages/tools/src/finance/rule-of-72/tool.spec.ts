import { describe, expect, it } from "vitest";
import { runRuleOf72 } from "./tool.js";
describe("Doubling Time Rule of 72 Calculator", () => {
  it("calculates a valid result", () => {
    expect(runRuleOf72({ annualRatePercent: 8 })).toEqual({
      ok: true,
      output: { years: 9 },
    });
  });
  it("rejects invalid input", () => expect(runRuleOf72(null).ok).toBe(false));
});
