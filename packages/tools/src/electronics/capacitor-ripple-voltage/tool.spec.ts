import { describe, expect, it } from "vitest";
import {
  capacitorRippleVoltageExample,
  runCapacitorRippleVoltage,
} from "./tool.js";
describe("Ripple Voltage", () => {
  it("publishes an executable example", () =>
    expect(
      runCapacitorRippleVoltage(capacitorRippleVoltageExample.input),
    ).toEqual({ ok: true, output: capacitorRippleVoltageExample.output }));
  it("yields zero ripple for zero current", () =>
    expect(
      runCapacitorRippleVoltage({
        rippleCurrentA: 0,
        frequencyHz: 1000,
        capacitanceF: 0.000001,
      }),
    ).toEqual({ ok: true, output: { rippleVoltageV: 0 } }));
  it("rejects zero frequency", () =>
    expect(
      runCapacitorRippleVoltage({
        rippleCurrentA: 1,
        frequencyHz: 0,
        capacitanceF: 0.000001,
      }).ok,
    ).toBe(false));
  it("rejects zero capacitance", () =>
    expect(
      runCapacitorRippleVoltage({
        rippleCurrentA: 1,
        frequencyHz: 1000,
        capacitanceF: 0,
      }).ok,
    ).toBe(false));
});
