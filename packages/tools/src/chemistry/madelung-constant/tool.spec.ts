import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateMadelungConstant,
  madelungConstantExample,
  MadelungConstantTool,
  runMadelungConstant,
} from "./tool.js";

describe("Madelung Constant Lookup", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runMadelungConstant(madelungConstantExample.input)).toEqual({
      ok: true,
      output: madelungConstantExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(MadelungConstantTool)).toEqual([]);
  });

  it("returns the textbook value for every supported lattice", () => {
    expect(
      calculateMadelungConstant({ crystalStructure: "cesium-chloride" })
        .madelungConstant,
    ).toBeCloseTo(1.7627, 4);
    expect(
      calculateMadelungConstant({ crystalStructure: "fluorite" })
        .madelungConstant,
    ).toBeGreaterThan(
      calculateMadelungConstant({ crystalStructure: "zinc-blende" })
        .madelungConstant,
    );
  });

  it("rejects unknown lattices and invalid input", () => {
    expect(runMadelungConstant({ crystalStructure: "perovskite" }).ok).toBe(
      false,
    );
    expect(runMadelungConstant(null).ok).toBe(false);
  });
});
