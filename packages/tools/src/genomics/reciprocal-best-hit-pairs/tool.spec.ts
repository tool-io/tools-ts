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
    expectIssue({}, "queryGenes", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("requires reciprocity and permits partial maps with no returned pair", () => {
    expect(calculate({ queryGenes: ["A"], forwardHits: ["missing"], targetGenes: [], reverseHits: [] })).toEqual({ reciprocalQueries: [], reciprocalTargets: [], pairCount: 0 });
    expectIssue({ ...example.input, targetGenes: ["X", "X"] }, "targetGenes");
    expectIssue({ ...example.input, forwardHits: ["X"] }, "forwardHits");
    expectIssue({ ...example.input, reverseHits: [" ", "A"] }, "reverseHits", "invalid_field");
  });
});
