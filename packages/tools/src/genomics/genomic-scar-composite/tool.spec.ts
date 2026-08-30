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
    expectIssue({}, "lohEvents", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("uses caller weights and includes the score threshold", () => {
    expect(calculate({ lohEvents: 4, telomericImbalances: 2, largeTransitions: 0, componentWeights: [0.5, 2, 1], scoreThreshold: 6 })).toEqual({ compositeScore: 6, aboveThreshold: true });
    expectIssue({ ...example.input, componentWeights: [Number.MAX_VALUE, 1, 1] }, "componentWeights", "result_overflow");
    expectIssue({ ...example.input, largeTransitions: 0.5 }, "largeTransitions", "invalid_field");
    expectIssue({ ...example.input, componentWeights: [1, 2] }, "componentWeights", "invalid_field");
  });
});
