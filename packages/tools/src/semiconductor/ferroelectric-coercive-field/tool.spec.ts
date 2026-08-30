import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFerroelectricCoerciveField, example } from "./tool.js";

describe("semiconductor/ferroelectric-coercive-field", () => {
  it("matches its worked example", () => {
    expect(calculateFerroelectricCoerciveField(example.input)).toEqual(
      example.output,
    );
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, coerciveVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative coerciveVolts", () => {
    expect(tool.execute({ ...example.input, coerciveVolts: -1 }).ok).toBe(
      false,
    );
  });
});
