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
    expectIssue({}, "referenceOrder", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("requires forward adjacency and reports duplicate comparison identifiers", () => {
    expect(calculate({ referenceOrder: ["A", "B", "C"], comparisonOrder: ["C", "B", "A"] })).toEqual({ conservedAdjacentPairs: 0, possibleAdjacentPairs: 2, collinearityFraction: 0 });
    expect(calculate({ referenceOrder: ["A", "B", "C"], comparisonOrder: ["A", "B", "C"] })).toEqual({ conservedAdjacentPairs: 2, possibleAdjacentPairs: 2, collinearityFraction: 1 });
    expectIssue({ ...example.input, comparisonOrder: ["A", "A"] }, "comparisonOrder");
  });
});
