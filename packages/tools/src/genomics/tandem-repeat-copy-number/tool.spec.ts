import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./index.js";
const expectIssue = (input: unknown, field: string, code: string): void => {
  const result = tool.execute(input);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected a structured input error.");
  expect(result.error.code).toBe("invalid_input");
  expect(result.error.issues).toEqual(
    expect.arrayContaining([expect.objectContaining({ field, code })]),
  );
};
describe(tool.id, () => {
  it("executes the canonical example exactly", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid contract and portable example", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expectIssue({}, "sequence", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });

  it("chooses the earliest tied run and counts only full copies", () => {
    expect(calculate({ sequence: "ATATGCATAT", motif: "AT" })).toEqual({ longestCopyNumber: 2, repeatStart: 0, repeatEnd: 4 });
    expect(calculate({ sequence: "AAAAA", motif: "AA" })).toEqual({ longestCopyNumber: 2, repeatStart: 0, repeatEnd: 4 });
  });
  it("uses -1 positions when no complete motif occurs", () => {
    expect(calculate({ sequence: "CGCG", motif: "AT" })).toEqual({ longestCopyNumber: 0, repeatStart: -1, repeatEnd: -1 });
    expect(calculate({ sequence: "AC", motif: "ACGT" })).toEqual({ longestCopyNumber: 0, repeatStart: -1, repeatEnd: -1 });
  });
  it("identifies an invalid motif rather than blaming the sequence", () => {
    expectIssue({ ...example.input, motif: "N" }, "motif", "invalid_field");
    expect(calculate({ sequence: "  atat  ", motif: " at " })).toEqual({ longestCopyNumber: 2, repeatStart: 0, repeatEnd: 4 });
  });
});
