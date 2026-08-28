import { describe, expect, it } from "vitest";
import {
  runWienBridgeOscillatorFrequency,
  wienBridgeOscillatorFrequencyExample,
} from "./tool.js";

describe("Wien Bridge Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWienBridgeOscillatorFrequency(
        wienBridgeOscillatorFrequencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: wienBridgeOscillatorFrequencyExample.output,
    });
  });

  it("matches the classic 1 k ohm 100 nF combination near 1.59 kHz", () => {
    expect(
      runWienBridgeOscillatorFrequency({ cFarads: 1e-7, rOhms: 1000 }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 1591.5494309189537 },
    });
  });

  it("halves the frequency when capacitance doubles", () => {
    expect(
      runWienBridgeOscillatorFrequency({ cFarads: 2e-8, rOhms: 10000 }),
    ).toEqual({
      ok: true,
      output: { oscillationFrequencyHz: 795.7747154594767 },
    });
  });

  it("rejects zero resistance", () => {
    expect(
      runWienBridgeOscillatorFrequency({ cFarads: 1e-9, rOhms: 0 }).ok,
    ).toBe(false);
  });

  it("rejects zero capacitance", () => {
    expect(
      runWienBridgeOscillatorFrequency({ cFarads: 0, rOhms: 10000 }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runWienBridgeOscillatorFrequency({ cFarads: 1e-9 }).ok).toBe(false);
  });
});
