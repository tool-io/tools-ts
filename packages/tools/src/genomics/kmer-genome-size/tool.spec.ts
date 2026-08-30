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
    expectIssue({}, "kmerOccurrences", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("preserves fractional estimates and zero retained occurrences", () => {
    expect(calculate({ kmerOccurrences: 90, lowCountErrorOccurrences: 45, mainPeakDepth: 10 })).toEqual({ retainedOccurrences: 45, estimatedGenomeBases: 4.5 });
    expect(calculate({ kmerOccurrences: 5, lowCountErrorOccurrences: 5, mainPeakDepth: 10 })).toEqual({ retainedOccurrences: 0, estimatedGenomeBases: 0 });
  });
  it("scales estimates and rejects invalid subtraction or overflow", () => {
    expect(calculate({ kmerOccurrences: 180, lowCountErrorOccurrences: 90, mainPeakDepth: 10 }).estimatedGenomeBases).toBe(9);
    expectIssue({ kmerOccurrences: 1, lowCountErrorOccurrences: 2, mainPeakDepth: 10 }, "lowCountErrorOccurrences", "invalid_value");
    expectIssue({ kmerOccurrences: 1, lowCountErrorOccurrences: 0, mainPeakDepth: Number.MIN_VALUE }, "mainPeakDepth", "result_overflow");
    expectIssue({ ...example.input, kmerOccurrences: 0.5 }, "kmerOccurrences", "invalid_field");
  });

  it("normalizes negative zero in count or coordinate outputs", () => {
    expect(calculate({ kmerOccurrences: -0, lowCountErrorOccurrences: 0, mainPeakDepth: 2 })).toEqual({ retainedOccurrences: 0, estimatedGenomeBases: 0 });
  });
});
