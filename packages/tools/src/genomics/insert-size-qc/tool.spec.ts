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
    expectIssue({}, "insertSizesBp", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("keeps the variance of large neighboring integers without centering on a rounded mean", () => {
    const value = Number.MAX_SAFE_INTEGER;
    expect(calculate({ insertSizesBp: [value, value, value], minimumMeanBp: value, maximumMeanBp: value, maximumSdBp: 0 })).toEqual({ meanInsertBp: value, sampleSdBp: 0, withinQcLimits: true });
    expect(calculate({ ...example.input, insertSizesBp: [value - 1, value], maximumMeanBp: value }).sampleSdBp).toBeCloseTo(Math.SQRT1_2, 14);
    expectIssue({ ...example.input, insertSizesBp: [100] }, "insertSizesBp", "invalid_field");
    expectIssue({ ...example.input, maximumMeanBp: 100 }, "maximumMeanBp");
  });
});
