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
    expectIssue({}, "firstAlignment", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("includes single gaps in the denominator and passes an exact threshold", () => {
    expect(calculate({ firstAlignment: "ac-", secondAlignment: "act", minimumIdentityFraction: 2 / 3 })).toEqual({ comparedColumns: 3, matchingColumns: 2, identityFraction: 2 / 3, passes: true });
  });
  it("identifies invalid second alignments and double gaps", () => {
    expectIssue({ ...example.input, secondAlignment: "ACNTG" }, "secondAlignment", "invalid_field");
    expectIssue({ ...example.input, secondAlignment: "ACT" }, "secondAlignment");
    expectIssue({ ...example.input, secondAlignment: "AC-GT" }, "secondAlignment");
    expectIssue({ ...example.input, secondAlignment: "ACTGT\n" }, "secondAlignment", "invalid_field");
  });
});
