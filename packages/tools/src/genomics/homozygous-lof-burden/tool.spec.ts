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
    expectIssue({}, "geneIds", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("groups only homozygous flagged variants and sorts genes", () => {
    expect(calculate({ geneIds: ["B", "A", "B", "C"], alternateAlleleCounts: [2, 2, 2, 1], lossOfFunctionFlags: [1, 1, 1, 1] })).toEqual({ burdenGenes: ["A", "B"], homozygousLofCounts: [1, 2], totalHomozygousLof: 3 });
    expectIssue({ ...example.input, lossOfFunctionFlags: [1, 2, 0] }, "lossOfFunctionFlags", "invalid_field");
    expectIssue({ ...example.input, alternateAlleleCounts: [2, 1] }, "alternateAlleleCounts");
  });
});
