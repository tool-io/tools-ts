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
    expectIssue({}, "log2Ratios", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("preserves the baseline at tiny purity and resolves representable scaled copies", () => {
    expect(calculate({ log2Ratios: [0], normalPloidy: 2, purityFraction: Number.MIN_VALUE })).toEqual({ observedCopyRatios: [1], tumorCopyNumbers: [2] });
    expect(calculate({ log2Ratios: [1], normalPloidy: Number.MIN_VALUE, purityFraction: Number.MIN_VALUE }).tumorCopyNumbers).toEqual([1]);
    expect(calculate({ log2Ratios: [Number.MIN_VALUE], normalPloidy: 1, purityFraction: Number.MIN_VALUE }).tumorCopyNumbers[0]).toBeCloseTo(1.6931471805599453, 14);
    expect(calculate({ log2Ratios: [-1074.5], normalPloidy: 2, purityFraction: 1 }).tumorCopyNumbers).toEqual([Number.MIN_VALUE]);
    expect(calculate({ log2Ratios: [-1075], normalPloidy: 2, purityFraction: 1 })).toEqual({ observedCopyRatios: [0], tumorCopyNumbers: [Number.MIN_VALUE] });
    expect(calculate({ log2Ratios: [-1, 0, 1], normalPloidy: 2, purityFraction: 0.5 })).toEqual({ observedCopyRatios: [0.5, 1, 2], tumorCopyNumbers: [0, 2, 6] });
  });
  it("rejects incompatible mixtures and finite-input result overflow", () => {
    expectIssue({ log2Ratios: [-2], normalPloidy: 2, purityFraction: 0.5 }, "log2Ratios");
    expectIssue({ ...example.input, log2Ratios: [1024] }, "log2Ratios", "result_overflow");
    expectIssue({ log2Ratios: [1], normalPloidy: Number.MAX_VALUE, purityFraction: 1 }, "log2Ratios", "result_overflow");
    expectIssue({ ...example.input, purityFraction: 0 }, "purityFraction", "invalid_field");
  });
});
