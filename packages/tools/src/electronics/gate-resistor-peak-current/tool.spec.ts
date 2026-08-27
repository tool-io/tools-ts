import { describe, expect, it } from "vitest";
import {
  gateResistorPeakCurrentExample,
  runGateResistorPeakCurrent,
} from "./tool.js";
describe("Gate Peak Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGateResistorPeakCurrent(gateResistorPeakCurrentExample.input),
    ).toEqual({
      ok: true,
      output: gateResistorPeakCurrentExample.output,
    });
  });
  it("divides driver voltage by gate resistance", () => {
    expect(
      runGateResistorPeakCurrent({ driverVolts: 15, gateResistorOhms: 4 }),
    ).toEqual({
      ok: true,
      output: { gatePeakCurrentA: 3.75 },
    });
  });
  it("rejects invalid input", () => {
    expect(
      runGateResistorPeakCurrent({ driverVolts: 0, gateResistorOhms: 10 }).ok,
    ).toBe(false);
  });
});
