import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateVaristorClampingVoltage, example } from "./tool.js";

describe("electronics/varistor-clamping-voltage", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateVaristorClampingVoltage(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, referenceVoltageV: Number.NaN }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{
        referenceVoltageV: 430,
        referenceCurrentAmperes: 1e-308,
        pulseCurrentAmperes: 1e308,
        nonlinearityExponent: 30,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.clampingVoltageV / 1.4682560157484543e23,
      ).toBeCloseTo(1, 8);
  });
  it("does not lose a representable result to intermediate underflow", () => {
    const result = tool.execute({
      ...example.input,
      ...{
        referenceVoltageV: 1e-200,
        referenceCurrentAmperes: 1e308,
        pulseCurrentAmperes: 1e-308,
        nonlinearityExponent: 30,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        result.output.clampingVoltageV / 2.928644564625136e-221,
      ).toBeCloseTo(1, 8);
  });
});
