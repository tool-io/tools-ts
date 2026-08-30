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
    expectIssue({}, "fasta", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("audits each record separately and permits protein symbols and CRLF", () => {
    expect(calculate({ fasta: ">protein\r\nMK*\r\nAA\r\n>dna\r\nACGTAC\r\n", expectedWidth: 4 })).toEqual({ recordCount: 2, nonterminalWidthViolations: 1, terminalWidthViolations: 1, consistent: false });
    expectIssue({ fasta: ">empty\n>other\nACGT", expectedWidth: 4 }, "fasta");
    expectIssue({ fasta: "ACGT\n>a\nAC", expectedWidth: 4 }, "fasta");
  });
});
