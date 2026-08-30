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
    expectIssue({}, "effectLabels", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("keeps supplied order for tied scores and rejects ambiguous labels", () => {
    expect(calculate({ effectLabels: ["A", "B", "C"], deltaScores: [0.5, 0.5, 1] })).toEqual({ rankedEffects: ["C", "A", "B"], rankedScores: [1, 0.5, 0.5], topEffect: "C" });
    expectIssue({ effectLabels: ["A", "A"], deltaScores: [0.5, 0.6] }, "effectLabels");
    expectIssue({ ...example.input, deltaScores: [0.5] }, "deltaScores");
    expectIssue({ ...example.input, deltaScores: [0.1, 0.2, 0.3, 1.1] }, "deltaScores", "invalid_field");
  });
});
