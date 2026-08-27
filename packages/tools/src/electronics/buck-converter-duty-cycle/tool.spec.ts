import { describe, expect, it } from "vitest";
import {
  buckConverterDutyCycleExample,
  calculateBuckConverterDutyCycle,
  runBuckConverterDutyCycle,
} from "./tool.js";

describe("Buck Duty Cycle", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBuckConverterDutyCycle(buckConverterDutyCycleExample.input),
    ).toEqual({
      ok: true,
      output: buckConverterDutyCycleExample.output,
    });
  });

  it("rejects output voltage above input voltage", () => {
    expect(
      runBuckConverterDutyCycle({ inputVolts: 5, outputVolts: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_output_volts" }] },
      ok: false,
    });
  });

  it("requires full duty only at equal voltages", () => {
    expect(
      calculateBuckConverterDutyCycle({
        inputVolts: 12,
        outputVolts: 12,
      }).dutyCyclePercent,
    ).toBe(100);
  });
});
