import { describe, expect, it } from "vitest";
import {
  calculateNanowireQuantumConfinement,
  nanowireQuantumConfinementExample,
  runNanowireQuantumConfinement,
} from "./tool.js";

describe("Cylindrical Nanowire Quantum Confinement Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNanowireQuantumConfinement(nanowireQuantumConfinementExample.input),
    ).toEqual({ ok: true, output: nanowireQuantumConfinementExample.output });
  });

  it("falls with the inverse square of diameter", () => {
    const narrow = calculateNanowireQuantumConfinement({
      diameterNm: 5,
      effectiveMassRatio: 0.067,
    }).confinementMilliEv;
    const wide = calculateNanowireQuantumConfinement({
      diameterNm: 10,
      effectiveMassRatio: 0.067,
    }).confinementMilliEv;
    expect(wide).toBeCloseTo(narrow / 4, 12);
  });

  it("falls inversely with effective mass", () => {
    const light = calculateNanowireQuantumConfinement({
      diameterNm: 10,
      effectiveMassRatio: 0.05,
    }).confinementMilliEv;
    const heavy = calculateNanowireQuantumConfinement({
      diameterNm: 10,
      effectiveMassRatio: 0.1,
    }).confinementMilliEv;
    expect(heavy).toBeCloseTo(light / 2, 12);
  });

  it("uses the circular hard-wall Bessel ground state", () => {
    expect(
      calculateNanowireQuantumConfinement({
        diameterNm: 1,
        effectiveMassRatio: 1,
      }).confinementMilliEv,
    ).toBeCloseTo(881.3534026489583, 12);
  });

  it("rejects non-positive diameters and masses", () => {
    expect(
      runNanowireQuantumConfinement({
        diameterNm: 0,
        effectiveMassRatio: 0.067,
      }).ok,
    ).toBe(false);
    expect(
      runNanowireQuantumConfinement({
        diameterNm: 10,
        effectiveMassRatio: -0.067,
      }).ok,
    ).toBe(false);
  });

  it("requires both physical inputs", () => {
    expect(runNanowireQuantumConfinement({ diameterNm: 10 }).ok).toBe(false);
  });
});
