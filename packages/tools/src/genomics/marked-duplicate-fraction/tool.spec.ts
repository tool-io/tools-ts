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
    expectIssue({}, "markedDuplicates", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("handles no duplicates and all duplicates without changing the total", () => {
    expect(calculate({ markedDuplicates: 0, totalReads: 5 })).toEqual({ duplicatePercent: 0, unmarkedReadCount: 5 });
    expect(calculate({ markedDuplicates: 5, totalReads: 5 })).toEqual({ duplicatePercent: 100, unmarkedReadCount: 0 });
    expectIssue({ markedDuplicates: 6, totalReads: 5 }, "markedDuplicates");
    expectIssue({ markedDuplicates: 0.5, totalReads: 5 }, "markedDuplicates", "invalid_field");
  });
});
