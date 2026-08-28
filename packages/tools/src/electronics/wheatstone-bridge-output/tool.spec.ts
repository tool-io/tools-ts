import { describe, expect, it } from "vitest";
import {
  runWheatstoneBridgeOutput,
  wheatstoneBridgeOutputExample,
} from "./tool.js";

describe("Bridge Output Voltage", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWheatstoneBridgeOutput(wheatstoneBridgeOutputExample.input),
    ).toEqual({
      ok: true,
      output: wheatstoneBridgeOutputExample.output,
    });
  });

  it("returns zero volts for a balanced bridge", () => {
    expect(
      runWheatstoneBridgeOutput({
        r1Ohms: 1000,
        r2Ohms: 1000,
        r3Ohms: 1000,
        r4Ohms: 1000,
        supplyVolts: 12,
      }),
    ).toEqual({ ok: true, output: { bridgeOutputVolts: 0 } });
  });

  it("returns positive output when R1 is the smaller divider top", () => {
    expect(
      runWheatstoneBridgeOutput({
        r1Ohms: 250,
        r2Ohms: 750,
        r3Ohms: 500,
        r4Ohms: 500,
        supplyVolts: 4,
      }),
    ).toEqual({ ok: true, output: { bridgeOutputVolts: 1 } });
  });

  it("responds symmetrically to the lower divider", () => {
    expect(
      runWheatstoneBridgeOutput({
        r1Ohms: 500,
        r2Ohms: 500,
        r3Ohms: 750,
        r4Ohms: 250,
        supplyVolts: 4,
      }),
    ).toEqual({ ok: true, output: { bridgeOutputVolts: 1 } });
  });

  it("rejects non-positive supplies or resistances", () => {
    expect(
      runWheatstoneBridgeOutput({
        r1Ohms: 900,
        r2Ohms: 100,
        r3Ohms: 500,
        r4Ohms: 500,
        supplyVolts: -5,
      }).ok,
    ).toBe(false);
    expect(
      runWheatstoneBridgeOutput({
        r1Ohms: 900,
        r2Ohms: 0,
        r3Ohms: 500,
        r4Ohms: 500,
        supplyVolts: 5,
      }).ok,
    ).toBe(false);
  });

  it("requires all inputs", () => {
    expect(
      runWheatstoneBridgeOutput({
        r1Ohms: 900,
        r2Ohms: 100,
        r4Ohms: 500,
        supplyVolts: 5,
      }).ok,
    ).toBe(false);
  });
});
