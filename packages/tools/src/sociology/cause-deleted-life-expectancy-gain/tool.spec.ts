import { describe, expect, it } from "vitest";
import {
  calculateCauseDeletedGain,
  causeDeletedLifeExpectancyGainExample,
  causeDeletedLifeExpectancyGainTool,
  runCauseDeletedLifeExpectancyGain,
} from "./tool.js";

describe("causeDeletedLifeExpectancyGainTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runCauseDeletedLifeExpectancyGain(
        causeDeletedLifeExpectancyGainExample.input,
      ),
    ).toEqual({
      ok: true,
      output: causeDeletedLifeExpectancyGainExample.output,
    });
  });

  it("returns a zero gain for equal life expectancies and rejects a decrease", () => {
    expect(
      calculateCauseDeletedGain({
        expectancyCauseDeletedYears: 80,
        expectancyCurrentYears: 80,
      }),
    ).toEqual({ gainYears: 0 });
    const result = runCauseDeletedLifeExpectancyGain({
      expectancyCauseDeletedYears: 79,
      expectancyCurrentYears: 80,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_value",
      field: "expectancyCauseDeletedYears",
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(causeDeletedLifeExpectancyGainExample)),
    ).toEqual(causeDeletedLifeExpectancyGainExample);
    expect(causeDeletedLifeExpectancyGainTool.contractVersion).toBe(1);
    expect(causeDeletedLifeExpectancyGainTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCauseDeletedLifeExpectancyGain(null).ok).toBe(false);
    expect(
      runCauseDeletedLifeExpectancyGain({
        ...causeDeletedLifeExpectancyGainExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
