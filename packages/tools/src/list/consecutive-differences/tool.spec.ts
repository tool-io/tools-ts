import { describe, expect, it } from "vitest";
import {
  calculateConsecutiveDifferences,
  consecutiveDifferencesExample,
  runConsecutiveDifferences,
} from "./tool.js";

describe("dataset consecutive differences", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runConsecutiveDifferences(consecutiveDifferencesExample.input)).toEqual(
      { ok: true, output: consecutiveDifferencesExample.output },
    );
  });

  it("handles two values and repeated values", () => {
    expect(calculateConsecutiveDifferences({ values: [5, 5] })).toEqual({
      differences: [0],
    });
    expect(calculateConsecutiveDifferences({ values: [1, 2, 4, 7] })).toEqual({
      differences: [1, 2, 3],
    });
  });

  it("rejects short inputs through execution", () => {
    expect(runConsecutiveDifferences({ values: [1] })).toMatchObject({
      error: { issues: [{ code: "insufficient_values" }] },
      ok: false,
    });
    expect(runConsecutiveDifferences({ values: [] }).ok).toBe(false);
  });
});
