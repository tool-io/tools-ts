import { describe, expect, it } from "vitest";
import {
  calculateHoleEffectiveMass,
  holeEffectiveMassExample,
  runHoleEffectiveMass,
} from "./tool.js";

describe("hole effective mass calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHoleEffectiveMass(holeEffectiveMassExample.input)).toEqual({
      ok: true,
      output: holeEffectiveMassExample.output,
    });
  });

  it("defaults the light-hole mass to the heavy value", () => {
    // Two equal populations contribute a 2^(2/3) factor to the DOS mass.
    expect(
      calculateHoleEffectiveMass({ heavyMassRatioX: 0.4 }).dosMassRatioX,
    ).toBeCloseTo(0.4 * 2 ** (2 / 3), 12);
  });

  it("never drops below the heavier band nor doubles it", () => {
    const output = calculateHoleEffectiveMass({
      heavyMassRatioX: 0.6,
      lightMassRatioX: 0.15,
    });
    expect(output.dosMassRatioX).toBeGreaterThan(0.6);
    expect(output.dosMassRatioX).toBeLessThan(0.6 * 2 ** (2 / 3));
  });
});
