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
    expectIssue({}, "instabilityFlags", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("includes an exact fraction threshold and accepts only binary flags", () => {
    expect(calculate({ instabilityFlags: [0, 1], minimumUnstableFraction: 0.5 })).toEqual({ unstableLoci: 1, testedLoci: 2, unstablePercent: 50, exceedsThreshold: true });
    expect(calculate({ instabilityFlags: [0, 0], minimumUnstableFraction: 0.5 }).exceedsThreshold).toBe(false);
    expectIssue({ ...example.input, instabilityFlags: [0, 2] }, "instabilityFlags", "invalid_field");
  });
});
