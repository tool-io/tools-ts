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
    expectIssue({}, "depths", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("keeps a constant large depth exact and counts both band boundaries", () => {
    const value = Number.MAX_SAFE_INTEGER;
    expect(calculate({ depths: [value, value, value], baseCounts: [1, 1, 1], minimumMeanFraction: 1, maximumMeanFraction: 1 })).toEqual({ meanDepth: value, withinBandBases: 3, withinBandPercent: 100 });
    expect(calculate({ depths: [5, 10, 15], baseCounts: [1, 1, 1], minimumMeanFraction: 0.5, maximumMeanFraction: 1.5 }).withinBandPercent).toBe(100);
    expectIssue({ ...example.input, baseCounts: [Number.MAX_SAFE_INTEGER, 1, 0] }, "baseCounts", "count_overflow");
    expectIssue({ ...example.input, maximumMeanFraction: 0.1 }, "maximumMeanFraction");
  });
});
