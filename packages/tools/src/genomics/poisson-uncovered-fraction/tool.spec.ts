import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./index.js";
const expectIssue = (input: unknown, field: string, code: string): void => {
  const result = tool.execute(input);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected a structured input error.");
  expect(result.error.code).toBe("invalid_input");
  expect(result.error.issues).toEqual(
    expect.arrayContaining([expect.objectContaining({ field, code })]),
  );
};
describe(tool.id, () => {
  it("executes the canonical example exactly", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "foldCoverage", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("predicts an entirely uncovered genome at zero depth", () => {
    expect(calculate({ foldCoverage: 0, genomeBases: 17 })).toEqual({ uncoveredFraction: 1, expectedUncoveredBases: 17 });
  });
  it("preserves a representable expected count when the fraction underflows", () => {
    const output = calculate({ foldCoverage: 750, genomeBases: Number.MAX_SAFE_INTEGER });
    expect(output.uncoveredFraction).toBe(0);
    expect(output.expectedUncoveredBases).toBeGreaterThan(0);
    // Independent 80-digit decimal evaluation of 9007199254740991 * exp(-750).
    expect(output.expectedUncoveredBases / 1.7128855385764227e-310).toBeCloseTo(1, 9);
  });
  it("decreases with depth and scales with genome length", () => {
    const one = calculate({ foldCoverage: 1, genomeBases: 100 });
    const two = calculate({ foldCoverage: 2, genomeBases: 100 });
    expect(two.uncoveredFraction).toBeLessThan(one.uncoveredFraction);
    expect(calculate({ foldCoverage: 1, genomeBases: 200 }).expectedUncoveredBases).toBe(2 * one.expectedUncoveredBases);
    expectIssue({ ...example.input, foldCoverage: -1 }, "foldCoverage", "invalid_field");
    expectIssue({ ...example.input, foldCoverage: NaN }, "foldCoverage", "invalid_field");
  });
});
