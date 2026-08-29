import { describe, expect, it } from "vitest";
import { runTurnoverNumber } from "./tool.js";

describe("Turnover Number Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTurnoverNumber({ molesProduct: 1, molesCatalyst: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ton).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runTurnoverNumber(null).ok).toBe(false));
});
