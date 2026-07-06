import { describe, expect, it } from "vitest";
import { runLogLoss } from "./tool.js";
describe("Log-Loss Calculator", () => {
  it("calculates a valid result", () => {
    const result = runLogLoss({ labels: [1, 0], probabilities: [0.8, 0.2] });
    expect(result.ok && result.output.logLoss).toBeCloseTo(-Math.log(0.8));
  });
  it("rejects invalid input", () => expect(runLogLoss(null).ok).toBe(false));
});
