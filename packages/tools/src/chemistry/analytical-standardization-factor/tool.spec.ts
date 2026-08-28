import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateStandardizationFactor,
  standardizationFactorExample,
  standardizationFactorTool,
} from "./tool.js";

describe("standardization factor", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateStandardizationFactor(standardizationFactorExample.input),
    ).toEqual({
      ok: true,
      output: standardizationFactorExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(standardizationFactorTool)).toEqual([]);
  });

  it("returns one when actual and nominal concentrations match", () => {
    expect(
      calculateStandardizationFactor({
        actualConcentrationMolPerL: 0.1,
        nominalConcentrationMolPerL: 0.1,
      }),
    ).toEqual({ ok: true, output: { standardizationFactor: 1 } });
  });
});
