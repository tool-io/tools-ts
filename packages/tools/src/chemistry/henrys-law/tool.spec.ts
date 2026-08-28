import { describe, expect, it } from "vitest";
import { runHenrysLaw, henrysLawExample } from "./tool.js";
describe("Henry's Law Calculator", () => {
  it("publishes an executable example", () =>
    expect(runHenrysLaw(henrysLawExample.input)).toEqual({
      ok: true,
      output: henrysLawExample.output,
    }));
  it("uses the constant directly at one atmosphere", () =>
    expect(
      runHenrysLaw({ henryConstantMolLAtm: 0.034, partialPressureAtm: 1 }),
    ).toEqual({ ok: true, output: { concentrationM: 0.034 } }));
  it("dissolves more gas under higher pressure", () => {
    const low = runHenrysLaw({
      henryConstantMolLAtm: 0.0013,
      partialPressureAtm: 1,
    });
    const high = runHenrysLaw({
      henryConstantMolLAtm: 0.0013,
      partialPressureAtm: 5,
    });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (low.ok && high.ok)
      expect(Number(high.output.concentrationM)).toBeGreaterThan(
        Number(low.output.concentrationM),
      );
  });
  it("scales linearly with pressure", () => {
    const base = runHenrysLaw({
      henryConstantMolLAtm: 0.0013,
      partialPressureAtm: 1,
    });
    const quadrupled = runHenrysLaw({
      henryConstantMolLAtm: 0.0013,
      partialPressureAtm: 4,
    });
    expect(base.ok).toBe(true);
    expect(quadrupled.ok).toBe(true);
    if (base.ok && quadrupled.ok)
      expect(
        Number(quadrupled.output.concentrationM) /
          Number(base.output.concentrationM),
      ).toBe(4);
  });
  it("rejects zero Henry constant", () =>
    expect(
      runHenrysLaw({ henryConstantMolLAtm: 0, partialPressureAtm: 1 }).ok,
    ).toBe(false));
  it("returns zero concentration at zero partial pressure", () =>
    expect(
      runHenrysLaw({ henryConstantMolLAtm: 0.034, partialPressureAtm: 0 }),
    ).toEqual({ ok: true, output: { concentrationM: 0 } }));
  it("rejects negative partial pressure", () =>
    expect(
      runHenrysLaw({ henryConstantMolLAtm: 0.034, partialPressureAtm: -1 }).ok,
    ).toBe(false));
});
