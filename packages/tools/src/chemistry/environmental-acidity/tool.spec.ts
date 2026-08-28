import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import { acidityExample, acidityTool, calculateAcidity } from "./tool.js";

describe("acidity", () => {
  it("reproduces the canonical example", () => {
    expect(calculateAcidity(acidityExample.input)).toEqual({
      ok: true,
      output: acidityExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(acidityTool)).toEqual([]);
  });

  it("allows a zero base volume", () => {
    expect(
      calculateAcidity({ ...acidityExample.input, baseVolumeMl: 0 }),
    ).toEqual({ ok: true, output: { acidityMgPerLAsCaCO3: 0 } });
  });
});
