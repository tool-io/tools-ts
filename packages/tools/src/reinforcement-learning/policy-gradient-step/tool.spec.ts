import { describe, expect, it } from "vitest";
import {
  calculatePolicyGradientStep,
  policyGradientExample,
  runPolicyGradient,
} from "./tool.js";
describe("Policy-Gradient Step", () => {
  it("raises the selected action logit", () =>
    expect(
      calculatePolicyGradientStep([0, 0, 0], 1, 2, 0.5, 0.1)?.logits[1],
    ).toBe(0.1));
  it("publishes an executable example", () =>
    expect(runPolicyGradient(policyGradientExample.input)).toEqual({
      ok: true,
      output: policyGradientExample.output,
    }));
});
