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
    expectIssue({}, "variantSizesBp", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("classifies both inclusive boundaries and validates their ordering", () => {
    expect(calculate({ variantSizesBp: [49, 50, 99, 100], svMinimumBp: 50, largeVariantMinimumBp: 100 })).toEqual({ sizeClasses: ["small", "structural", "structural", "large-structural"] });
    expectIssue({ ...example.input, largeVariantMinimumBp: 50 }, "largeVariantMinimumBp");
    expectIssue({ ...example.input, variantSizesBp: [0.5] }, "variantSizesBp", "invalid_field");
  });
});
