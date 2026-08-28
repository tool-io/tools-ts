import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateNuclearPackingFraction,
  nuclearPackingFractionExample,
  nuclearPackingFractionTool,
} from "./tool.js";

describe("nuclear packing fraction", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateNuclearPackingFraction(nuclearPackingFractionExample.input),
    ).toEqual({
      ok: true,
      output: nuclearPackingFractionExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(nuclearPackingFractionTool)).toEqual([]);
  });

  it("allows negative packing fractions", () => {
    const result = calculateNuclearPackingFraction({
      atomicMassU: 3.99,
      massNumber: 4,
    });
    expect(result).toMatchObject({ ok: true });
    if (result.ok)
      expect(result.output.packingFractionPerTenThousand).toBeLessThan(0);
  });
});
