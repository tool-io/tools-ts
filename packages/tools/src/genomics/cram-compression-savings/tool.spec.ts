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
    expectIssue({}, "bamBytes", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("reports negative savings when CRAM is larger", () => {
    expect(calculate({ bamBytes: 100, cramBytes: 200 })).toEqual({ compressionRatio: 0.5, savingsPercent: -100, savedBytes: -100 });
    expectIssue({ bamBytes: 0, cramBytes: 1 }, "bamBytes", "invalid_field");
    expectIssue({ bamBytes: 1, cramBytes: Number.MAX_SAFE_INTEGER + 1 }, "cramBytes", "invalid_field");
  });
});
