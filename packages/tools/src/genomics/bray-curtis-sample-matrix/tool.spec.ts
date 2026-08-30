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
  it("is symmetric and rejects zero-total samples", () => {
    const matrix = calculate(example.input).dissimilarityMatrix;
    expect(matrix[0][2]).toBe(matrix[2][0]);
    expect(
      tool.execute({
        sampleCounts: [
          [0, 0],
          [1, 0],
        ],
      }),
    ).toMatchObject({ ok: false });
  });
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
    expectIssue({}, "sampleCounts", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("retains the Bray-Curtis ratio when abundance sums overflow", () => {
    expect(calculate({ sampleCounts: [[1e308, 0], [0, 1e308], [1e308, 1e308]] }).dissimilarityMatrix).toEqual([[0, 1, 1 / 3], [1, 0, 1 / 3], [1 / 3, 1 / 3, 0]]);
    expect(calculate({ sampleCounts: [[Number.MIN_VALUE], [Number.MIN_VALUE]] }).dissimilarityMatrix).toEqual([[0, 0], [0, 0]]);
    expectIssue({ sampleCounts: [[1], [-1]] }, "sampleCounts", "invalid_field");
  });
});
