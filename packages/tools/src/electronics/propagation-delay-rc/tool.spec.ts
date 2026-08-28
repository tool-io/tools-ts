import { describe, expect, it } from "vitest";
import {
  calculatePropagationDelayRc,
  propagationDelayRcExample,
  runPropagationDelayRc,
} from "./tool.js";

describe("RC Propagation Delay", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPropagationDelayRc(propagationDelayRcExample.input)).toEqual({
      ok: true,
      output: propagationDelayRcExample.output,
    });
  });

  it("uses the 0.69 ln(2) factor for one time constant", () => {
    expect(
      calculatePropagationDelayRc({ rOhms: 1000, cLoadFarads: 1e-9 })
        .propagationDelayNs,
    ).toBeCloseTo(690);
  });

  it("converts ohms times farads into nanoseconds", () => {
    expect(
      calculatePropagationDelayRc({ rOhms: 2200, cLoadFarads: 1e-11 })
        .propagationDelayNs,
    ).toBeCloseTo(15.18);
  });

  it("doubles with doubled resistance", () => {
    const base = calculatePropagationDelayRc({
      rOhms: 500,
      cLoadFarads: 1e-10,
    }).propagationDelayNs;
    const doubled = calculatePropagationDelayRc({
      rOhms: 1000,
      cLoadFarads: 1e-10,
    }).propagationDelayNs;
    expect(doubled).toBeCloseTo(base * 2);
  });

  it("doubles with doubled capacitance", () => {
    const base = calculatePropagationDelayRc({
      rOhms: 330,
      cLoadFarads: 5e-11,
    }).propagationDelayNs;
    const doubled = calculatePropagationDelayRc({
      rOhms: 330,
      cLoadFarads: 1e-10,
    }).propagationDelayNs;
    expect(doubled).toBeCloseTo(base * 2);
  });

  it("rejects zero resistance", () => {
    expect(
      runPropagationDelayRc({ rOhms: 0, cLoadFarads: 1e-10 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_r_ohms" }] },
      ok: false,
    });
  });

  it("rejects zero load capacitance", () => {
    expect(
      runPropagationDelayRc({ rOhms: 10000, cLoadFarads: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_c_load_farads" }] },
      ok: false,
    });
  });
});
