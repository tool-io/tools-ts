import { describe, expect, it } from "vitest";
import { runInitialRate } from "./tool.js";

describe("Initial Rate Calculator", () => {
  it("calculates a valid result", () => {
    const result = runInitialRate({
      concentrationA: 1,
      concentrationB: 1,
      orderA: 1,
      orderB: 1,
      rateConstantK: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.initialRateMolLs).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runInitialRate(null).ok).toBe(false));
});
