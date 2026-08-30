import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBatteryInternalImpedance, example } from "./tool.js";

describe("electronics/battery-internal-impedance", () => {
  it("matches its worked example", () => {
    expect(calculateBatteryInternalImpedance(example.input)).toEqual(
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
      tool.execute({ ...example.input, openCircuitVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative openCircuitVolts", () => {
    expect(tool.execute({ ...example.input, openCircuitVolts: -1 }).ok).toBe(
      false,
    );
  });
});
