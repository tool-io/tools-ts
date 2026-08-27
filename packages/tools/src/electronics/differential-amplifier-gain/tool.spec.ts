import { describe, expect, it } from "vitest";
import {
  calculateDifferentialAmplifierGain,
  differentialAmplifierGainExample,
  runDifferentialAmplifierGain,
} from "./tool.js";

describe("Diff Amp Gain", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDifferentialAmplifierGain(differentialAmplifierGainExample.input),
    ).toEqual({
      ok: true,
      output: differentialAmplifierGainExample.output,
    });
  });

  it("returns unity for matched resistors", () => {
    expect(
      calculateDifferentialAmplifierGain({
        feedbackResistorOhms: 4700,
        inputResistorOhms: 4700,
      }).differentialGain,
    ).toBe(1);
  });

  it("attenuates when feedback is smaller than input resistance", () => {
    expect(
      calculateDifferentialAmplifierGain({
        feedbackResistorOhms: 1000,
        inputResistorOhms: 4000,
      }).differentialGain,
    ).toBe(0.25);
  });

  it("handles fractional resistor values", () => {
    expect(
      calculateDifferentialAmplifierGain({
        feedbackResistorOhms: 2.5,
        inputResistorOhms: 0.5,
      }).differentialGain,
    ).toBe(5);
  });

  it("scales proportionally with the feedback resistor", () => {
    const base = calculateDifferentialAmplifierGain({
      feedbackResistorOhms: 1000,
      inputResistorOhms: 500,
    }).differentialGain;
    const doubled = calculateDifferentialAmplifierGain({
      feedbackResistorOhms: 2000,
      inputResistorOhms: 500,
    }).differentialGain;
    expect(doubled).toBe(base * 2);
  });

  it("rejects zero feedback resistance", () => {
    expect(
      runDifferentialAmplifierGain({
        feedbackResistorOhms: 0,
        inputResistorOhms: 1000,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_feedback_resistor" }] },
      ok: false,
    });
  });

  it("rejects zero input resistance", () => {
    expect(
      runDifferentialAmplifierGain({
        feedbackResistorOhms: 10000,
        inputResistorOhms: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input_resistor" }] },
      ok: false,
    });
  });
});
