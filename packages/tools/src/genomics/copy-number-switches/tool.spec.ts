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
    expectIssue({}, "copyNumberStates", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("requires two switches, ignores equal neighbors, and excludes three-state runs", () => {
    expect(calculate({ copyNumberStates: [1, 1, 2, 2] })).toEqual({ switchCount: 1, distinctStates: 2, twoStateOscillation: false });
    expect(calculate({ copyNumberStates: [1, 2, 3, 1] })).toEqual({ switchCount: 3, distinctStates: 3, twoStateOscillation: false });
    expectIssue({ copyNumberStates: [1, 1.5] }, "copyNumberStates", "invalid_field");
  });
});
