import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateQuantumCascadeLaserWavelength,
  example,
} from "./tool.js";

describe("semiconductor/quantum-cascade-laser-wavelength", () => {
  it("matches its worked example", () => {
    expect(calculateQuantumCascadeLaserWavelength(example.input)).toEqual(
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
      tool.execute({ ...example.input, transitionElectronVolts: Number.NaN })
        .ok,
    ).toBe(false);
  });
  it("rejects a negative transitionElectronVolts", () => {
    expect(
      tool.execute({ ...example.input, transitionElectronVolts: -1 }).ok,
    ).toBe(false);
  });
});
