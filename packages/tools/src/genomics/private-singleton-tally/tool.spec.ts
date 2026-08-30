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
  it("excludes private homozygous variants and supports an empty call set", () => {
    expect(calculate({ variantIds: ["homo", "het"], targetAlternateDosages: [2, 1], otherSampleAlternateAlleles: [0, 0] })).toEqual({ privateSingletonIds: ["het"], singletonCount: 1 });
    expect(calculate({ variantIds: [], targetAlternateDosages: [], otherSampleAlternateAlleles: [] })).toEqual({ privateSingletonIds: [], singletonCount: 0 });
    expectIssue({ ...example.input, targetAlternateDosages: [1, 2] }, "targetAlternateDosages");
  });
});
