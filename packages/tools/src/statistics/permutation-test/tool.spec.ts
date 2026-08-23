import { describe, expect, it } from "vitest";
import {
  calculatePermutationTest,
  permutationTestExample,
  runPermutationTest,
} from "./tool.js";

describe("statistics/permutation-test", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPermutationTest(permutationTestExample.input)).toEqual({
      ok: true,
      output: permutationTestExample.output,
    });
  });

  it("rejects empty samples with a structured error", () => {
    const result = runPermutationTest({ sampleA: [], sampleB: [1] });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_sample");
  });

  it("rejects samples larger than the enumeration guard of 8", () => {
    const result = runPermutationTest({
      sampleA: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      sampleB: [1],
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("sample_too_large");
  });

  it("gives the smallest possible p value for completely separated samples", () => {
    const result = calculatePermutationTest({
      sampleA: [1, 2],
      sampleB: [100, 200],
    });
    expect(result.assignmentCount).toBe(6);
    expect(result.pValue).toBeCloseTo(1 / 3, 12);
  });
});
