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
    expectIssue({}, "sequence", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("finds a reverse-complement arm across a spacer and skips impossible spans", () => {
    expect(calculate({ sequence: "ATGACAT", armLength: 3, spacerLength: 1 })).toEqual({ leftArmStarts: [0], rightArmStarts: [4], repeatCount: 1 });
    expect(calculate({ sequence: "ATGC", armLength: Number.MAX_SAFE_INTEGER, spacerLength: 0 })).toEqual({ leftArmStarts: [], rightArmStarts: [], repeatCount: 0 });
    expect(calculate({ sequence: "AAAAAA", armLength: 3, spacerLength: 0 }).repeatCount).toBe(0);
    expectIssue({ ...example.input, armLength: 0 }, "armLength", "invalid_field");
  });
});
