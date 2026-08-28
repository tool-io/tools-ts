import { describe, expect, it } from "vitest";
import {
  redoxEquivalentWeightExample,
  runRedoxEquivalentWeight,
} from "./tool.js";
describe("Redox Equivalent Weight", () => {
  it("publishes an executable example", () =>
    expect(
      runRedoxEquivalentWeight(redoxEquivalentWeightExample.input),
    ).toEqual({
      ok: true,
      output: redoxEquivalentWeightExample.output,
    }));
  it("returns the full molar mass for a one-electron change", () =>
    expect(
      runRedoxEquivalentWeight({
        molarMassGPerMol: 55.85,
        electronChangeInt: 1,
      }),
    ).toEqual({ ok: true, output: { equivalentWeightG: 55.85 } }));
  it("matches permanganate five-electron reduction closely", () => {
    const result = runRedoxEquivalentWeight({
      molarMassGPerMol: 158.04,
      electronChangeInt: 5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.equivalentWeightG).toBeCloseTo(31.608, 6);
  });
  it("halves the equivalent weight when electrons double", () =>
    expect(
      runRedoxEquivalentWeight({
        molarMassGPerMol: 55.85,
        electronChangeInt: 2,
      }),
    ).toEqual({ ok: true, output: { equivalentWeightG: 27.925 } }));
  it("rejects zero molar mass", () =>
    expect(
      runRedoxEquivalentWeight({ molarMassGPerMol: 0, electronChangeInt: 2 })
        .ok,
    ).toBe(false));
  it("rejects negative molar mass", () =>
    expect(
      runRedoxEquivalentWeight({
        molarMassGPerMol: -63.55,
        electronChangeInt: 2,
      }).ok,
    ).toBe(false));
  it("rejects zero electrons transferred", () =>
    expect(
      runRedoxEquivalentWeight({
        molarMassGPerMol: 63.55,
        electronChangeInt: 0,
      }).ok,
    ).toBe(false));
  it("rejects fractional electron counts", () =>
    expect(
      runRedoxEquivalentWeight({
        molarMassGPerMol: 63.55,
        electronChangeInt: 1.5,
      }).ok,
    ).toBe(false));
});
