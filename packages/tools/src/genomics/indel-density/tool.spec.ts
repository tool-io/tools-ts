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
    expectIssue({}, "insertionCount", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("converts callable bases to kilobases and rejects an unsafe indel sum", () => {
    expect(calculate({ insertionCount: 3, deletionCount: 1, callableBases: 2000 })).toEqual({ totalIndels: 4, indelsPerKilobase: 2 });
    expectIssue({ insertionCount: Number.MAX_SAFE_INTEGER, deletionCount: 1, callableBases: 1000 }, "deletionCount", "count_overflow");
    expectIssue({ ...example.input, callableBases: 0 }, "callableBases", "invalid_field");
  });
});
