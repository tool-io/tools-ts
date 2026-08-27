import { describe, expect, it } from "vitest";
import {
  calculateEmiFilterCutoffFrequency,
  emiFilterCutoffFrequencyExample,
  runEmiFilterCutoffFrequency,
} from "./tool.js";

describe("emi filter cutoff frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEmiFilterCutoffFrequency(emiFilterCutoffFrequencyExample.input),
    ).toEqual({ ok: true, output: emiFilterCutoffFrequencyExample.output });
  });

  it("reports kilohertz from SI henries and farads", () => {
    expect(
      calculateEmiFilterCutoffFrequency({ cFarads: 1e-6, lHenry: 1e-3 })
        .cutoffFrequencyKhz,
    ).toBeCloseTo(159154.94309189534, 9);
  });

  it("drops proportionally as either component grows", () => {
    const base = calculateEmiFilterCutoffFrequency({
      cFarads: 1e-7,
      lHenry: 1e-3,
    }).cutoffFrequencyKhz;
    expect(base / 2).toBeCloseTo(
      calculateEmiFilterCutoffFrequency({ cFarads: 2e-7, lHenry: 1e-3 })
        .cutoffFrequencyKhz,
      12,
    );
    expect(base / 10).toBeCloseTo(
      calculateEmiFilterCutoffFrequency({ cFarads: 1e-7, lHenry: 1e-2 })
        .cutoffFrequencyKhz,
      9,
    );
  });

  it("stays consistent with the reciprocal two pi LC definition", () => {
    const lHenry = 4.7e-3;
    const cFarads = 220e-9;
    expect(
      calculateEmiFilterCutoffFrequency({ cFarads, lHenry }).cutoffFrequencyKhz,
    ).toBeCloseTo(1 / (2 * Math.PI * lHenry * cFarads) / 1000, 15);
  });

  it("rejects non-positive components through execution", () => {
    expect(
      runEmiFilterCutoffFrequency({ cFarads: 1e-6, lHenry: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_inductance", field: "lHenry" }] },
      ok: false,
    });
    expect(
      runEmiFilterCutoffFrequency({ cFarads: 0, lHenry: 1e-3 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_capacitance", field: "cFarads" }] },
      ok: false,
    });
  });

  it("attenuates well below cutoff for a typical EMI corner", () => {
    const cutoffKhz = calculateEmiFilterCutoffFrequency({
      cFarads: 1e-6,
      lHenry: 0.01,
    }).cutoffFrequencyKhz;
    expect(cutoffKhz).toBeGreaterThan(0);
    expect(cutoffKhz).toBeCloseTo(15915.494309189533, 9);
  });
});
