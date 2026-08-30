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
  it("uses overlapping complete windows and ignores an incomplete tail", () => {
    expect(
      calculate({ sequence: "GCAA", windowLength: 3, stepLength: 1 }),
    ).toEqual({
      windowStarts: [0, 1],
      gcPercent: [(100 * 2) / 3, 100 / 3],
    });
  });
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

  it("keeps a complete first window when the step is longer than the sequence", () => {
    expect(calculate({ sequence: "  gcaa  ", windowLength: 4, stepLength: 100 })).toEqual({ windowStarts: [0], gcPercent: [50] });
    expect(calculate({ sequence: "ACGT", windowLength: 1, stepLength: 1 })).toEqual({ windowStarts: [0, 1, 2, 3], gcPercent: [0, 100, 100, 0] });
  });
  it("rejects windows that cannot fit and zero steps", () => {
    expectIssue({ sequence: "ACGT", windowLength: 5, stepLength: 1 }, "windowLength", "invalid_value");
    expectIssue({ ...example.input, stepLength: 0 }, "stepLength", "invalid_field");
  });
});
