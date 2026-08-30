import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBrownOutThresholdCheck, example } from "./tool.js";

describe("microcontroller/brown-out-threshold-check", () => {
  it("matches its worked example", () => {
    expect(calculateBrownOutThresholdCheck(example.input)).toEqual(
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
    expect(tool.execute({ ...example.input, supplyVolts: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative supplyVolts", () => {
    expect(tool.execute({ ...example.input, supplyVolts: -1 }).ok).toBe(false);
  });
});
