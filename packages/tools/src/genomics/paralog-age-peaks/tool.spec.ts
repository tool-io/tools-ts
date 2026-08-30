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
    expectIssue({}, "binCenters", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("excludes edge maxima and plateaus while including a minimum-count peak", () => {
    expect(calculate({ binCenters: [0, 1, 2, 3, 4], paralogCounts: [9, 5, 5, 4, 9], minimumPeakCount: 4 })).toEqual({ peakCenters: [], peakCounts: [] });
    expect(calculate({ binCenters: [0, 1, 2], paralogCounts: [1, 4, 1], minimumPeakCount: 4 })).toEqual({ peakCenters: [1], peakCounts: [4] });
    expectIssue({ ...example.input, binCenters: [0.1, 0.2, 0.2, 0.4, 0.5] }, "binCenters");
    expectIssue({ ...example.input, paralogCounts: [1, 2, 3] }, "paralogCounts");
  });
});
