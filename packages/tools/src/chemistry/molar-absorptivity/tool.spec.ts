import { describe, expect, it } from "vitest";
import { runMolarAbsorptivity, molarAbsorptivityExample } from "./tool.js";
describe("Molar Absorptivity Calculator", () => {
  it("publishes an executable example", () =>
    expect(runMolarAbsorptivity(molarAbsorptivityExample.input)).toEqual({
      ok: true,
      output: molarAbsorptivityExample.output,
    }));
  it("returns unity for unit inputs", () =>
    expect(
      runMolarAbsorptivity({
        absorbance: 1,
        concentrationM: 1,
        pathLengthCm: 1,
      }),
    ).toEqual({ ok: true, output: { molarAbsorptivity: 1 } }));
  it("doubles when absorbance doubles", () =>
    expect(
      runMolarAbsorptivity({
        absorbance: 1.5,
        concentrationM: 0.5,
        pathLengthCm: 3,
      }),
    ).toEqual({ ok: true, output: { molarAbsorptivity: 1 } }));
  it("matches a typical dye measurement closely", () => {
    const result = runMolarAbsorptivity({
      absorbance: 0.42,
      concentrationM: 2e-5,
      pathLengthCm: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.molarAbsorptivity).toBeCloseTo(21000, 6);
  });
  it("rejects zero absorbance", () =>
    expect(
      runMolarAbsorptivity({
        absorbance: 0,
        concentrationM: 1,
        pathLengthCm: 1,
      }).ok,
    ).toBe(false));
  it("rejects zero concentration", () =>
    expect(
      runMolarAbsorptivity({
        absorbance: 1,
        concentrationM: 0,
        pathLengthCm: 1,
      }).ok,
    ).toBe(false));
  it("rejects zero path length", () =>
    expect(
      runMolarAbsorptivity({
        absorbance: 1,
        concentrationM: 1,
        pathLengthCm: 0,
      }).ok,
    ).toBe(false));
});
