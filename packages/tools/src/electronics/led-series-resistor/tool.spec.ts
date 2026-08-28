import { describe, expect, it } from "vitest";
import {
  calculateLedSeriesResistor,
  ledSeriesResistorExample,
  runLedSeriesResistor,
} from "./tool.js";

describe("led series resistor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLedSeriesResistor(ledSeriesResistorExample.input)).toEqual({
      ok: true,
      output: ledSeriesResistorExample.output,
    });
  });

  it("drops the leftover voltage across the resistor", () => {
    const r = calculateLedSeriesResistor(
      ledSeriesResistorExample.input,
    ).resistorOhms;
    expect(r * ledSeriesResistorExample.input.forwardCurrentA).toBeCloseTo(
      ledSeriesResistorExample.input.supplyVoltageV -
        ledSeriesResistorExample.input.forwardVoltageV,
      12,
    );
    // Higher supply needs a bigger resistor.
    expect(
      calculateLedSeriesResistor({
        forwardCurrentA: 0.02,
        forwardVoltageV: 2,
        supplyVoltageV: 12,
      }).resistorOhms,
    ).toBe(
      calculateLedSeriesResistor({
        forwardCurrentA: 0.02,
        forwardVoltageV: 2,
        supplyVoltageV: 5,
      }).resistorOhms +
        (12 - 5) / 0.02,
    );
  });

  it("rejects a supply at or below the forward voltage", () => {
    for (const bad of [
      { forwardCurrentA: 0.02, forwardVoltageV: 2, supplyVoltageV: 2 },
      { forwardCurrentA: 0.02, forwardVoltageV: 3, supplyVoltageV: 2 },
      { forwardCurrentA: 0, forwardVoltageV: 2, supplyVoltageV: 5 },
    ])
      expect(runLedSeriesResistor(bad).ok).toBe(false);
  });
});
