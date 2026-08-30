import { describe, expect, it } from "vitest";
import {
  assumptionReversalExample,
  generateAssumptionReversalQuestions,
  runAssumptionReversal,
} from "./tool.js";

describe("assumption reversal question generator", () => {
  it("reproduces its canonical example", () => {
    expect(runAssumptionReversal(assumptionReversalExample.input)).toEqual({
      ok: true,
      output: assumptionReversalExample.output,
    });
  });

  it("generates three questions per assumption", () => {
    expect(
      generateAssumptionReversalQuestions({ assumptions: ["A", "B"] })
        .reversalCount,
    ).toBe(6);
  });

  it("normalizes reversed-assumption casing", () => {
    expect(
      generateAssumptionReversalQuestions({ assumptions: ["A Future"] })
        .reversedAssumptions[0],
    ).toBe("A Future is not true.");
  });

  it("rejects duplicate assumptions", () => {
    expect(
      runAssumptionReversal({ assumptions: ["Same", "same"] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "duplicate_assumption", field: "assumptions" }],
      },
      ok: false,
    });
  });
});
