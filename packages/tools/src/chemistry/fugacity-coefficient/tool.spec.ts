import { describe, expect, it } from "vitest";
import { runFugacityCoefficient } from "./tool.js";

describe("Fugacity Coefficient Calculator", () => {
  it("calculates a valid result", () => {
    const result = runFugacityCoefficient({ fugacityAtm: 1, pressureAtm: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.phiCoefficient).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runFugacityCoefficient(null).ok).toBe(false));
});
