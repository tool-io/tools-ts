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
    expectIssue({}, "referenceBases", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("supports lowercase bases and rejects identity or undefined ratios", () => {
    expect(calculate({ referenceBases: ["a", "c"], alternateBases: ["g", "a"], minimumRatio: 1, maximumRatio: 1 })).toEqual({ transitions: 1, transversions: 1, titvRatio: 1, withinRange: true });
    expectIssue({ ...example.input, alternateBases: ["A", "T", "C", "T"] }, "alternateBases");
    expectIssue({ referenceBases: ["A"], alternateBases: ["G"], minimumRatio: 0, maximumRatio: 2 }, "alternateBases");
    expectIssue({ ...example.input, alternateBases: ["N", "T", "C", "T"] }, "alternateBases", "invalid_field");
  });
});
