import { describe, expect, it } from "vitest";
import {
  calculateFinQuantumConfinement,
  finQuantumConfinementExample,
  runFinQuantumConfinement,
} from "./tool.js";

describe("Fin Quantum Confinement Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFinQuantumConfinement(finQuantumConfinementExample.input),
    ).toEqual({ ok: true, output: finQuantumConfinementExample.output });
  });

  it("falls with the inverse square of fin width", () => {
    const narrow = calculateFinQuantumConfinement({
      effectiveMassRatio: 0.19,
      finWidthNm: 5,
    }).confinementMilliEv;
    const wide = calculateFinQuantumConfinement({
      effectiveMassRatio: 0.19,
      finWidthNm: 10,
    }).confinementMilliEv;
    expect(wide).toBeCloseTo(narrow / 4, 12);
  });

  it("falls inversely with effective mass", () => {
    const light = calculateFinQuantumConfinement({
      effectiveMassRatio: 0.1,
      finWidthNm: 5,
    }).confinementMilliEv;
    const heavy = calculateFinQuantumConfinement({
      effectiveMassRatio: 0.2,
      finWidthNm: 5,
    }).confinementMilliEv;
    expect(heavy).toBeCloseTo(light / 2, 12);
  });

  it("matches the free-electron infinite-well coefficient", () => {
    expect(
      calculateFinQuantumConfinement({
        effectiveMassRatio: 1,
        finWidthNm: 1,
      }).confinementMilliEv,
    ).toBeCloseTo(376.0301621559356, 12);
  });

  it("rejects non-positive widths and masses", () => {
    expect(
      runFinQuantumConfinement({ effectiveMassRatio: 0.19, finWidthNm: 0 }).ok,
    ).toBe(false);
    expect(
      runFinQuantumConfinement({ effectiveMassRatio: 0, finWidthNm: 5 }).ok,
    ).toBe(false);
  });

  it("requires both physical inputs", () => {
    expect(runFinQuantumConfinement({ finWidthNm: 5 }).ok).toBe(false);
  });
});
