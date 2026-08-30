import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateSuperjunctionChargeBalance, example } from "./tool.js";

describe("semiconductor/superjunction-charge-balance", () => {
  it("matches its worked example", () => {
    expect(calculateSuperjunctionChargeBalance(example.input)).toEqual(
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
      tool.execute({ ...example.input, donorPerCubicMeter: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative donorPerCubicMeter", () => {
    expect(tool.execute({ ...example.input, donorPerCubicMeter: -1 }).ok).toBe(
      false,
    );
  });
});
