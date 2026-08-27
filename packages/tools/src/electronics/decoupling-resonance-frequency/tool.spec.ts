import { describe, expect, it } from "vitest";
import {
  calculateDecouplingResonanceFrequency,
  decouplingResonanceFrequencyExample,
  runDecouplingResonanceFrequency,
} from "./tool.js";

describe("decoupling resonance frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDecouplingResonanceFrequency(
        decouplingResonanceFrequencyExample.input,
      ),
    ).toEqual({ ok: true, output: decouplingResonanceFrequencyExample.output });
  });

  it("yields about 159.155 MHz per square root of one nanohenry times nanofarad", () => {
    expect(
      calculateDecouplingResonanceFrequency({ cNf: 4, lNh: 4 })
        .resonanceFrequencyMhz,
    ).toBeCloseTo(159.155 / 4, 15);
  });

  it("matches the SI resonance of mounted nanohenries and nanofarads", () => {
    const lNh = 10;
    const cNf = 100;
    const hertz = 1 / (2 * Math.PI * Math.sqrt(lNh * 1e-9 * cNf * 1e-9));
    expect(
      calculateDecouplingResonanceFrequency({ cNf, lNh }).resonanceFrequencyMhz,
    ).toBeCloseTo(5.032923010040984, 15);
    expect(hertz / 1e6).toBeCloseTo(5.03292, 4);
  });

  it("falls with the square root of larger L C products", () => {
    const small = calculateDecouplingResonanceFrequency({
      cNf: 1,
      lNh: 1,
    }).resonanceFrequencyMhz;
    const large = calculateDecouplingResonanceFrequency({
      cNf: 100,
      lNh: 100,
    }).resonanceFrequencyMhz;
    expect(large).toBeCloseTo(small / 100, 15);
  });

  it("rejects non-positive inputs through execution", () => {
    expect(runDecouplingResonanceFrequency({ cNf: 1, lNh: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_inductance", field: "lNh" }] },
      ok: false,
    });
    expect(runDecouplingResonanceFrequency({ cNf: -1, lNh: 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_capacitance", field: "cNf" }] },
      ok: false,
    });
  });

  it("places typical 100 nF decaps near ten megahertz", () => {
    expect(
      calculateDecouplingResonanceFrequency({ cNf: 100, lNh: 2.5 })
        .resonanceFrequencyMhz,
    ).toBeGreaterThan(5);
    expect(
      calculateDecouplingResonanceFrequency({ cNf: 100, lNh: 2.5 })
        .resonanceFrequencyMhz,
    ).toBeLessThan(50);
  });
});
