import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const expectIssue = (input: unknown, field: string, code = "invalid_value"): void => {
  expect(tool.execute(input)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ code, field }] } });
};
describe(tool.id, () => {
  it("computes the independent canonical example", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "sequenceCounts", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("flags strictly above the threshold and rejects an impossible sequence histogram", () => {
    expect(calculate({ sequenceCounts: [20, 21], totalReads: 100, maximumFraction: 0.2 })).toEqual({ sequenceFractions: [0.2, 0.21], flaggedIndexes: [1] });
    expectIssue({ sequenceCounts: [60, 60], totalReads: 100, maximumFraction: 0.5 }, "sequenceCounts");
    expectIssue({ sequenceCounts: [Number.MAX_SAFE_INTEGER, 1], totalReads: Number.MAX_SAFE_INTEGER, maximumFraction: 0.5 }, "sequenceCounts");
  });
});
