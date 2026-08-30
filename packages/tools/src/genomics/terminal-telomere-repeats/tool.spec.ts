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

  it("counts both terminal runs while counting their overlapping bases once", () => {
    expect(calculate({ sequence: "ATATAT", repeatMotif: "AT" })).toEqual({ leftTerminalCopies: 3, rightTerminalCopies: 3, terminalRepeatBases: 6 });
    expect(calculate({ sequence: "ATATA", repeatMotif: "ATA" })).toEqual({ leftTerminalCopies: 1, rightTerminalCopies: 1, terminalRepeatBases: 5 });
  });
  it("ignores internal repeats and identifies an invalid supplied motif", () => {
    expect(calculate({ sequence: "GGATATGG", repeatMotif: "AT" })).toEqual({ leftTerminalCopies: 0, rightTerminalCopies: 0, terminalRepeatBases: 0 });
    expectIssue({ ...example.input, repeatMotif: "N" }, "repeatMotif", "invalid_field");
  });
});
