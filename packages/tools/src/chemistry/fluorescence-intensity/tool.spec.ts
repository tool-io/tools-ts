import { describe, expect, it } from "vitest";
import {
  fluorescenceIntensityExample,
  runFluorescenceIntensity,
} from "./tool.js";
describe("Fluorescence Intensity", () => {
  it("publishes an executable example", () =>
    expect(
      runFluorescenceIntensity(fluorescenceIntensityExample.input),
    ).toEqual({
      ok: true,
      output: fluorescenceIntensityExample.output,
    }));
  it("scales linearly with quantum yield", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: 1,
        absorptivityConstant: 10000,
        concentrationM: 1e-6,
        excitationIntensity: 100,
      }),
    ).toEqual({ ok: true, output: { fluorescenceIntensity: 1 } }));
  it("vanishes at zero quantum yield", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: 0,
        absorptivityConstant: 10000,
        concentrationM: 1e-6,
        excitationIntensity: 100,
      }),
    ).toEqual({ ok: true, output: { fluorescenceIntensity: 0 } }));
  it("doubles when excitation intensity doubles", () => {
    const result = runFluorescenceIntensity({
      quantumYieldFraction: 0.8,
      absorptivityConstant: 20000,
      concentrationM: 2e-7,
      excitationIntensity: 50,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.fluorescenceIntensity).toBeCloseTo(0.16, 12);
  });
  it("rejects quantum yields above one", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: 1.5,
        absorptivityConstant: 10000,
        concentrationM: 1e-6,
        excitationIntensity: 100,
      }).ok,
    ).toBe(false));
  it("rejects negative quantum yield", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: -0.1,
        absorptivityConstant: 10000,
        concentrationM: 1e-6,
        excitationIntensity: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero absorptivity constant", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: 0.5,
        absorptivityConstant: 0,
        concentrationM: 1e-6,
        excitationIntensity: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero concentration", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: 0.5,
        absorptivityConstant: 10000,
        concentrationM: 0,
        excitationIntensity: 100,
      }).ok,
    ).toBe(false));
  it("rejects zero excitation intensity", () =>
    expect(
      runFluorescenceIntensity({
        quantumYieldFraction: 0.5,
        absorptivityConstant: 10000,
        concentrationM: 1e-6,
        excitationIntensity: 0,
      }).ok,
    ).toBe(false));
});
