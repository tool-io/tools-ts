import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateSingleElectronTransistorCoulombGap,
  example,
} from "./tool.js";

describe("semiconductor/single-electron-transistor-coulomb-gap", () => {
  it("matches its worked example", () => {
    expect(calculateSingleElectronTransistorCoulombGap(example.input)).toEqual(
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
      tool.execute({ ...example.input, totalCapacitanceFarads: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative totalCapacitanceFarads", () => {
    expect(
      tool.execute({ ...example.input, totalCapacitanceFarads: -1 }).ok,
    ).toBe(false);
  });
});
