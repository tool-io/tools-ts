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
    expectIssue({}, "readSequences", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("finds the longest terminal prefix despite repeated full and partial matches", () => {
    expect(calculate({ readSequences: ["AACACACAC", "GGACA", "ACACG"], adapterSequence: "ACAC", minimumMatchBases: 2 })).toEqual({ contaminatedReadIndexes: [0, 1], trailingAdapterBases: [4, 3, 0], contaminatedReadPercent: 200 / 3 });
    expectIssue({ ...example.input, minimumMatchBases: 4 }, "minimumMatchBases");
    expectIssue({ ...example.input, adapterSequence: "NAA" }, "adapterSequence", "invalid_field");
    expectIssue({ ...example.input, readSequences: ["ACGN"] }, "readSequences", "invalid_field");
  });
  it("enforces the character budget before scanning read bases", () => {
    expectIssue({ ...example.input, readSequences: Array.from({ length: 11 }, () => "A".repeat(1000000)) }, "readSequences", "resource_limit_exceeded");
  });
});
