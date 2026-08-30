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
    expectIssue({}, "singleCopyComplete", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("counts duplicated BUSCO groups once and guards unsafe aggregate counts", () => {
    expect(calculate({ singleCopyComplete: 0, duplicatedComplete: 2, fragmented: 1, missing: 1 })).toEqual({ completePercent: 50, singleCopyPercent: 0, totalOrthologs: 4 });
    expectIssue({ singleCopyComplete: 0, duplicatedComplete: 0, fragmented: 0, missing: 0 }, "singleCopyComplete");
    expectIssue({ ...example.input, singleCopyComplete: Number.MAX_SAFE_INTEGER }, "singleCopyComplete", "count_overflow");
    expectIssue({ ...example.input, missing: 0.5 }, "missing", "invalid_field");
  });
});
