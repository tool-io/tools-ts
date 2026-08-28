import { describe, expect, it } from "vitest";
import {
  microphoneSensitivityVoltageExample,
  runMicrophoneSensitivityVoltage,
} from "./tool.js";

const outputOf = (input: { sensitivityDbV: number }) => {
  const result = runMicrophoneSensitivityVoltage(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { micSensitivityMvPerPa: number };
};

describe("Mic Sensitivity mV/Pa", () => {
  it("reproduces the canonical example", () =>
    expect(
      runMicrophoneSensitivityVoltage(
        microphoneSensitivityVoltageExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { micSensitivityMvPerPa: 12.589254117941675 },
    }));

  it("references zero dBV to one volt per pascal", () =>
    expect(outputOf({ sensitivityDbV: 0 }).micSensitivityMvPerPa).toBeCloseTo(
      1000,
      9,
    ));

  it("loses six millivolts-ish per doubling in dB terms", () => {
    const atMinus6 = outputOf({ sensitivityDbV: -6 }).micSensitivityMvPerPa;
    expect(atMinus6).toBeCloseTo(Math.pow(10, -0.3) * 1000, 9);
  });

  it("drops twenty dBV per decade of linear sensitivity", () => {
    const ten = outputOf({ sensitivityDbV: -20 }).micSensitivityMvPerPa;
    expect(ten).toBeCloseTo(100, 9);
    const hundred = outputOf({ sensitivityDbV: -40 }).micSensitivityMvPerPa;
    expect(hundred).toBeCloseTo(10, 9);
  });

  it("matches ten to the dBV over twenty times one thousand generally", () => {
    const { micSensitivityMvPerPa } = outputOf({ sensitivityDbV: -27.5 });
    expect(micSensitivityMvPerPa).toBeCloseTo(
      Math.pow(10, -27.5 / 20) * 1000,
      9,
    );
  });

  it("accepts the extreme schema bounds", () => {
    expect(
      outputOf({ sensitivityDbV: -100 }).micSensitivityMvPerPa,
    ).toBeCloseTo(0.01, 9);
    expect(outputOf({ sensitivityDbV: 10 }).micSensitivityMvPerPa).toBeCloseTo(
      Math.pow(10, 0.5) * 1000,
      9,
    );
  });

  it("rejects sensitivities outside minus one hundred to ten", () => {
    expect(runMicrophoneSensitivityVoltage({ sensitivityDbV: -100.5 }).ok).toBe(
      false,
    );
    expect(runMicrophoneSensitivityVoltage({ sensitivityDbV: 10.5 }).ok).toBe(
      false,
    );
  });
});
