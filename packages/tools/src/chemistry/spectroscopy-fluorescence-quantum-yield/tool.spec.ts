import { describe, expect, it } from "vitest";
import {
  runFluorescenceQuantumYield,
  fluorescenceQuantumYieldExample,
} from "./tool.js";
describe("Fluorescence QY Compare", () => {
  it("publishes an executable example", () =>
    expect(
      runFluorescenceQuantumYield(fluorescenceQuantumYieldExample.input),
    ).toEqual({ ok: true, output: fluorescenceQuantumYieldExample.output }));
  it("matches the reference for equal integrals and indices", () =>
    expect(
      runFluorescenceQuantumYield({
        quantumYieldReference: 0.95,
        integralSample: 800,
        integralReference: 800,
        refractiveIndexSample: 1.36,
        refractiveIndexReference: 1.36,
      }),
    ).toEqual({ ok: true, output: { quantumYieldSample: 0.95 } }));
  it("applies the square of the refractive index ratio", () =>
    expect(
      runFluorescenceQuantumYield({
        quantumYieldReference: 1,
        integralSample: 2,
        integralReference: 1,
        refractiveIndexSample: 3,
        refractiveIndexReference: 1,
      }),
    ).toEqual({ ok: true, output: { quantumYieldSample: 18 } }));
  it("accepts a zero reference quantum yield", () =>
    expect(
      runFluorescenceQuantumYield({
        quantumYieldReference: 0,
        integralSample: 2,
        integralReference: 1,
        refractiveIndexSample: 1,
        refractiveIndexReference: 1,
      }),
    ).toEqual({ ok: true, output: { quantumYieldSample: 0 } }));
  it("rejects zero sample integral", () =>
    expect(
      runFluorescenceQuantumYield({
        quantumYieldReference: 0.5,
        integralSample: 0,
        integralReference: 3000,
        refractiveIndexSample: 1.33,
        refractiveIndexReference: 1.33,
      }).ok,
    ).toBe(false));
  it("rejects a reference quantum yield above one", () =>
    expect(
      runFluorescenceQuantumYield({
        quantumYieldReference: 1.5,
        integralSample: 1500,
        integralReference: 3000,
        refractiveIndexSample: 1.33,
        refractiveIndexReference: 1.33,
      }).ok,
    ).toBe(false));
});
