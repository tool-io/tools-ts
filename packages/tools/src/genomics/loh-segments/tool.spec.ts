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
    expectIssue({}, "segmentStarts", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("merges only contiguous qualifying segments and sums lengths before adding", () => {
    expect(calculate({ segmentStarts: [0, 2, 4], segmentEnds: [2, 4, 6], minorCopyNumbers: [0, 1, 0], maximumMinorCopies: 0 })).toEqual({ lohStarts: [0, 4], lohEnds: [2, 6], lohBases: 4 });
    const maximum = Number.MAX_SAFE_INTEGER;
    expect(calculate({ segmentStarts: [0, maximum - 1], segmentEnds: [2, maximum], minorCopyNumbers: [0, 0], maximumMinorCopies: 0 }).lohBases).toBe(3);
    expectIssue({ ...example.input, segmentEnds: [0, 20, 30] }, "segmentEnds");
  });
});
