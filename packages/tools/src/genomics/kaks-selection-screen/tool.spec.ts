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
    expectIssue({}, "nonsynonymousRate", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("uses a caller-defined neutral band and rejects unrepresentable ratios", () => {
    expect(calculate({ nonsynonymousRate: 0.5, synonymousRate: 0.5, neutralTolerance: 0 })).toEqual({ kaksRatio: 1, selectionBand: "near-neutral" });
    expect(calculate({ nonsynonymousRate: 2, synonymousRate: 0.5, neutralTolerance: 0.25 }).selectionBand).toBe("above-neutral");
    expectIssue({ ...example.input, synonymousRate: Number.MIN_VALUE }, "synonymousRate", "result_overflow");
    expectIssue({ ...example.input, neutralTolerance: 1.1 }, "neutralTolerance", "invalid_field");
  });
});
