import { describe, expect, it } from "vitest";
import {
  runWellLogPermeabilityWyllieRose,
  wellLogPermeabilityWyllieRoseExample,
} from "./tool.js";

describe("well-log-permeability-wyllie-rose", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellLogPermeabilityWyllieRose(
        wellLogPermeabilityWyllieRoseExample.input,
      ),
    ).toEqual({
      ok: true,
      output: wellLogPermeabilityWyllieRoseExample.output,
    });
  });

  it("scales with the chosen exponents", () => {
    const result = runWellLogPermeabilityWyllieRose({
      coefficient: 10000,
      porosity: 0.2,
      irreducibleWaterSaturation: 0.3,
      porosityExponent: 4.4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.permeabilityMd as number).toBeCloseTo(
      (10000 * 0.2 ** 4.4) / 0.3 ** 2,
      9,
    );
  });

  it("rejects non-positive coefficients", () => {
    expect(
      runWellLogPermeabilityWyllieRose({
        coefficient: -1,
        porosity: 0.2,
        irreducibleWaterSaturation: 0.3,
      }).ok,
    ).toBe(false);
  });
});
