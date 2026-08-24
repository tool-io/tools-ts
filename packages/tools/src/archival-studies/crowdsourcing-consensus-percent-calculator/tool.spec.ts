import { describe, expect, it } from "vitest";
import {
  calculateCrowdsourcingConsensusPercentCalculator,
  crowdsourcingConsensusPercentCalculatorExample,
  runCrowdsourcingConsensusPercentCalculator,
} from "./tool.js";

describe("archival-studies/crowdsourcing-consensus-percent-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCrowdsourcingConsensusPercentCalculator(
        crowdsourcingConsensusPercentCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: crowdsourcingConsensusPercentCalculatorExample.output,
    });
  });

  it("reports unanimous consensus at one hundred percent", () => {
    const result = calculateCrowdsourcingConsensusPercentCalculator({
      agreeingContributions: 5,
      totalContributions: 5,
    });
    expect(result.agreementPercent).toBe(100);
    expect(result.dissentingContributions).toBe(0);
  });

  it("rejects agreement counts above the total", () => {
    expect(
      runCrowdsourcingConsensusPercentCalculator({
        agreeingContributions: 9,
        totalContributions: 8,
      }).ok,
    ).toBe(false);
  });
});
