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
    expectIssue({}, "synonymousDistance", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("uses two evolutionary branches without overflowing a doubled rate", () => {
    expect(calculate({ synonymousDistance: 1, substitutionsPerSitePerYear: 0.25 })).toEqual({ divergenceYears: 2, divergenceMillionYears: 0.000002 });
    expect(calculate({ synonymousDistance: Number.MAX_VALUE, substitutionsPerSitePerYear: Number.MAX_VALUE }).divergenceYears).toBe(0.5);
    expectIssue({ synonymousDistance: Number.MAX_VALUE, substitutionsPerSitePerYear: Number.MIN_VALUE }, "substitutionsPerSitePerYear", "result_overflow");
  });
});
