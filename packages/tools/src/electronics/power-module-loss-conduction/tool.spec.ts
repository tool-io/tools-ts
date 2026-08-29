import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculatePowerModuleLossConduction, example } from "./tool.js";

describe("electronics/power-module-loss-conduction", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePowerModuleLossConduction(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, rmsCurrentAmperes: Number.NaN }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ rmsCurrentAmperes: 1e200, onResistanceOhms: 1e-200 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.conductionLossW / 1e200).toBeCloseTo(1, 8);
  });
  it("does not lose a representable result to intermediate underflow", () => {
    const result = tool.execute({
      ...example.input,
      ...{ rmsCurrentAmperes: 1e-200, onResistanceOhms: 1e300 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.conductionLossW / 1e-100).toBeCloseTo(1, 8);
  });
});
