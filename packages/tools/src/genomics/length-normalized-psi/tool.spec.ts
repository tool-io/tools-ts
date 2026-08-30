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
  it("uses effective lengths and rejects unsupported zero read totals", () => {
    expect(
      calculate({
        inclusionReads: 10,
        skippingReads: 10,
        inclusionEffectiveLength: 200,
        skippingEffectiveLength: 100,
      }).psiPercent,
    ).toBeCloseTo(100 / 3);
    expect(
      tool.execute({ ...example.input, inclusionReads: 0, skippingReads: 0 }),
    ).toMatchObject({ ok: false });
  });
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
    expectIssue({}, "inclusionReads", "invalid_field");
    expectIssue({ ...example.input, unexpected: true }, "unexpected", "unknown_field");
  });
  it("normalizes overflowing sums and requires finite reported densities", () => {
    const large = calculate({ inclusionReads: 1, skippingReads: 1, inclusionEffectiveLength: 1e-308, skippingEffectiveLength: 1e-308 });
    expect(large.psiPercent).toBe(50);
    expect(large.inclusionDensity).toBe(1e308);
    expect(calculate({ inclusionReads: 1, skippingReads: 1, inclusionEffectiveLength: Number.MAX_VALUE, skippingEffectiveLength: Number.MAX_VALUE }).psiPercent).toBe(50);
    expect(calculate({ inclusionReads: 3, skippingReads: 1, inclusionEffectiveLength: 2, skippingEffectiveLength: 1 })).toEqual({ inclusionDensity: 1.5, skippingDensity: 1, psiPercent: 60 });
    expectIssue({ ...example.input, inclusionEffectiveLength: Number.MIN_VALUE }, "inclusionEffectiveLength", "result_overflow");
  });
});
