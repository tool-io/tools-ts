import { describe, expect, it } from "vitest";
import {
  inductorRippleCurrentExample,
  runInductorRippleCurrent,
} from "./tool.js";
describe("Inductor Ripple Current", () => {
  it("publishes an executable example", () =>
    expect(
      runInductorRippleCurrent(inductorRippleCurrentExample.input),
    ).toEqual({ ok: true, output: inductorRippleCurrentExample.output }));
  it("yields zero ripple at zero duty", () =>
    expect(
      runInductorRippleCurrent({
        vin: 12,
        vout: 5,
        dutyFraction: 0,
        lHenry: 0.001,
        switchingFrequencyHz: 100000,
      }),
    ).toEqual({ ok: true, output: { rippleCurrentA: 0 } }));
  it("rejects zero inductance", () =>
    expect(
      runInductorRippleCurrent({
        vin: 12,
        vout: 5,
        dutyFraction: 0.5,
        lHenry: 0,
        switchingFrequencyHz: 100000,
      }).ok,
    ).toBe(false));
  it("rejects out-of-range duty", () =>
    expect(
      runInductorRippleCurrent({
        vin: 12,
        vout: 5,
        dutyFraction: 1.5,
        lHenry: 0.001,
        switchingFrequencyHz: 100000,
      }).ok,
    ).toBe(false));
});
