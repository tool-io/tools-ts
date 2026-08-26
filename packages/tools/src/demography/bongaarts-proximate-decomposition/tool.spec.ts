import { describe, expect, it } from "vitest";
import {
  calculateBongaartsProximateDecomposition,
  runBongaartsProximateDecomposition,
  bongaartsProximateDecompositionExample,
} from "./tool.js";

describe("demography/bongaarts-proximate-decomposition", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBongaartsProximateDecomposition(
        bongaartsProximateDecompositionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: bongaartsProximateDecompositionExample.output,
    });
  });

  it("returns the TFR itself when every index equals one", () => {
    expect(
      calculateBongaartsProximateDecomposition({
        tfr: 4,
        indexMarriageCm: 1,
        indexContraceptionCc: 1,
        indexAbortionCa: 1,
      }),
    ).toEqual({ totalFecundityTf: 4 });
  });

  it("rejects out-of-range indexes", () => {
    expect(
      runBongaartsProximateDecomposition({
        tfr: 3.5,
        indexMarriageCm: 1.2,
        indexContraceptionCc: 0.8,
        indexAbortionCa: 0.95,
      }).ok,
    ).toBe(false);
    expect(
      runBongaartsProximateDecomposition({
        tfr: 3.5,
        indexMarriageCm: 0,
        indexContraceptionCc: 0.8,
        indexAbortionCa: 0.95,
      }).ok,
    ).toBe(false);
  });
});
