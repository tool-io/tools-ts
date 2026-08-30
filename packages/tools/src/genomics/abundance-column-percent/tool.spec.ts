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
    expectIssue({}, "taxonSampleCounts", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("normalizes large finite weights without overflowing the numerator", () => {
    expect(calculate({ taxonSampleCounts: [[1e308], [0]] })).toEqual({ columnTotals: [1e308], abundancePercent: [[100], [0]] });
    expectIssue({ taxonSampleCounts: [[1e308], [1e308]] }, "taxonSampleCounts", "result_overflow");
  });
  it("rejects empty columns, ragged matrices and sparse cells", () => {
    expectIssue({ taxonSampleCounts: [[0], [0]] }, "taxonSampleCounts");
    expectIssue({ taxonSampleCounts: [[1], [1, 2]] }, "taxonSampleCounts");
    expectIssue({ taxonSampleCounts: [new Array<number>(1)] }, "taxonSampleCounts", "invalid_field");
    expectIssue({ taxonSampleCounts: [Array.from({ length: 129 }, () => 1)] }, "taxonSampleCounts", "invalid_field");
  });
});
