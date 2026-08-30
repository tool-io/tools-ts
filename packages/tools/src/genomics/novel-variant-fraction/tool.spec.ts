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
    expectIssue({}, "variantIds", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("preserves caller order and treats duplicate database entries as membership", () => {
    expect(calculate({ variantIds: ["C", "A", "B", "D"], databaseVariantIds: ["A", "A", "D"] })).toEqual({ novelVariantIds: ["C", "B"], novelPercent: 50 });
    expectIssue({ variantIds: ["A", "A"], databaseVariantIds: [] }, "variantIds");
    expectIssue({ ...example.input, databaseVariantIds: [""] }, "databaseVariantIds", "invalid_field");
  });
});
