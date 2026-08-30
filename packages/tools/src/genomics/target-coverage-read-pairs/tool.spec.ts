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
    expectIssue({}, "targetBases", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("does not add a pair because an intermediate product rounds upward", () => {
    // 0.4 is exactly four times the represented 0.1: three pairs supply 12 raw bases.
    expect(calculate({ targetBases: 3, targetDepth: 0.4, readLength: 2, usablePairFraction: 0.1 })).toEqual({ requiredReadPairs: 3, requiredRawReadBases: 12 });
  });
  it("rounds a true positive remainder up and never underflows to zero pairs", () => {
    expect(calculate({ targetBases: 1, targetDepth: 1.0000000000000002, readLength: 1, usablePairFraction: 0.5 })).toEqual({ requiredReadPairs: 2, requiredRawReadBases: 4 });
    expect(calculate({ targetBases: 1, targetDepth: Number.MIN_VALUE, readLength: 1, usablePairFraction: 1 })).toEqual({ requiredReadPairs: 1, requiredRawReadBases: 2 });
  });
  it("accepts a safe raw total and rejects overflowing plans", () => {
    expect(calculate({ targetBases: 1, targetDepth: 1, readLength: 4503599627370495, usablePairFraction: 1 })).toEqual({ requiredReadPairs: 1, requiredRawReadBases: 9007199254740990 });
    expectIssue({ ...example.input, targetDepth: Number.MAX_VALUE }, "targetDepth", "count_overflow");
    expectIssue({ ...example.input, usablePairFraction: 0 }, "usablePairFraction", "invalid_field");
    expectIssue({ ...example.input, usablePairFraction: 1.01 }, "usablePairFraction", "invalid_field");
  });
});
