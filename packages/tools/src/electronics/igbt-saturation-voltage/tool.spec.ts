import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateIgbtSaturationVoltage, example } from "./tool.js";

describe("electronics/igbt-saturation-voltage", () => {
  it("matches the canonical example and direct calculation", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateIgbtSaturationVoltage(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and malformed inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, voltageInterceptV: Number.NaN }).ok,
    ).toBe(false);
  });
  it("handles a zero boundary", () => {
    expect(tool.execute({ ...example.input, voltageInterceptV: 0 })).toEqual({
      ok: true,
      output: { saturationVoltageV: 1 },
    });
  });
});
