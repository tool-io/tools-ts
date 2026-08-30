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
    expectIssue({}, "gcBinFractions", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("clamps excess depth to zero deficit and chooses the first tied bin", () => {
    expect(calculate({ gcBinFractions: [0.1, 0.5, 0.9], meanDepths: [0, 100, 0], minimumExpectedDepth: 10 })).toEqual({ depthDeficitFractions: [1, 0, 1], worstGcBin: 0.1, maximumDropoutFraction: 1 });
    expectIssue({ ...example.input, meanDepths: [10, Number.NaN, 10] }, "meanDepths", "invalid_field");
    expectIssue({ ...example.input, gcBinFractions: [0.2, 0.5, 1.1] }, "gcBinFractions", "invalid_field");
  });
});
