import { describe, expect, it } from "vitest";
import {
  calculateProbabilityFirstCause,
  probabilityFirstCauseExample,
  runProbabilityFirstCause,
} from "./tool.js";

describe("probability first cause calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runProbabilityFirstCause(probabilityFirstCauseExample.input),
    ).toEqual({
      ok: true,
      output: probabilityFirstCauseExample.output,
    });
  });

  it("splits probabilities by hazard size", () => {
    const result = calculateProbabilityFirstCause({
      causeIndex: 1,
      decrementRates: [0.75, 0.25],
    });
    expect(result.firstCauseProbability).toBeGreaterThan(0.5);
    const other = runProbabilityFirstCause({
      causeIndex: 2,
      decrementRates: [0.75, 0.25],
    });
    expect(other.ok && other.output.firstCauseProbability).toBeLessThan(0.5);
  });

  it("rejects out-of-range cause indexes and empty lists", () => {
    expect(
      runProbabilityFirstCause({
        causeIndex: 3,
        decrementRates: [0.5, 0.5],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_cause_index" }] },
      ok: false,
    });
    expect(
      runProbabilityFirstCause({ causeIndex: 1, decrementRates: [] }).ok,
    ).toBe(false);
  });
});
