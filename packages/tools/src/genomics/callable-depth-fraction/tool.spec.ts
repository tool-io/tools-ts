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
    expectIssue({}, "depthValues", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("includes the minimum depth and rejects unsafe or ambiguous histograms", () => {
    expect(calculate({ depthValues: [20, 0, 10], baseCounts: [2, 1, 1], minimumDepth: 10 })).toEqual({ callableBases: 3, totalBases: 4, callablePercent: 75 });
    expectIssue({ ...example.input, baseCounts: [1] }, "baseCounts");
    expectIssue({ ...example.input, depthValues: [0, 10, 10] }, "depthValues");
    expectIssue({ ...example.input, baseCounts: [Number.MAX_SAFE_INTEGER, 1, 0] }, "baseCounts", "count_overflow");
  });
});
