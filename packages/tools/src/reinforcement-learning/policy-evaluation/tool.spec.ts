import { describe, expect, it } from "vitest";
import {
  evaluatePolicy,
  policyEvaluationExample,
  runPolicyEvaluation,
} from "./tool.js";
describe("Policy Evaluation", () => {
  it("converges on a finite-state value function", () =>
    expect(
      evaluatePolicy(
        [1, 0],
        [
          [0.5, 0.5],
          [0.2, 0.8],
        ],
        0.9,
        100,
      ),
    ).toEqual(policyEvaluationExample.output.values));
  it("rejects non-stochastic transitions", () =>
    expect(
      runPolicyEvaluation({
        ...policyEvaluationExample.input,
        transitions: [
          [1, 1],
          [0, 1],
        ],
      }).ok,
    ).toBe(false));
  it("publishes an executable example", () =>
    expect(runPolicyEvaluation(policyEvaluationExample.input)).toEqual({
      ok: true,
      output: policyEvaluationExample.output,
    }));
});
