import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateGrapheneFermiVelocity, example } from "./tool.js";

describe("semiconductor/graphene-fermi-velocity", () => {
  it("matches its worked example", () => {
    expect(calculateGrapheneFermiVelocity(example.input)).toEqual(
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
      tool.execute({ ...example.input, energyElectronVolts: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative energyElectronVolts", () => {
    expect(tool.execute({ ...example.input, energyElectronVolts: -1 }).ok).toBe(
      false,
    );
  });
});
