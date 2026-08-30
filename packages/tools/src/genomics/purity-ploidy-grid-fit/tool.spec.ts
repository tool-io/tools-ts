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
    expectIssue({}, "purityValues", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("chooses the first row-major minimum and validates grid shape", () => {
    expect(calculate({ purityValues: [0.25, 0.75], ploidyValues: [2, 4], residualGrid: [[1, 1], [0, 0]] })).toEqual({ bestPurity: 0.75, bestPloidy: 2, minimumResidual: 0 });
    expectIssue({ ...example.input, residualGrid: [[1], [0]] }, "residualGrid");
    expectIssue({ ...example.input, purityValues: [0.5, 1.1] }, "purityValues", "invalid_field");
    expectIssue({ ...example.input, residualGrid: [[1, 2], new Array<number>(2)] }, "residualGrid", "invalid_field");
  });
});
