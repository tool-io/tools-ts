import { describe, expect, it } from "vitest";
import { bayesianRuleListExample, runBayesianRuleList } from "./tool.js";
describe("Bayesian rule list", () => {
  it("publishes an executable example", () =>
    expect(runBayesianRuleList(bayesianRuleListExample.input)).toEqual({
      ok: true,
      output: bayesianRuleListExample.output,
    }));
});
