import { describe, expect, it } from "vitest";
import {
  calculateInstrumentationAmplifierGain,
  instrumentationAmplifierGainExample,
  runInstrumentationAmplifierGain,
} from "./tool.js";

describe("InAmp Gain", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInstrumentationAmplifierGain(
        instrumentationAmplifierGainExample.input,
      ),
    ).toEqual({
      ok: true,
      output: instrumentationAmplifierGainExample.output,
    });
  });

  it("uses the documented INA128-style 49400 ohm constant", () => {
    expect(
      calculateInstrumentationAmplifierGain({ rGainOhms: 49400 })
        .instrumentationGain,
    ).toBe(2);
  });

  it("grows without bound as Rg shrinks", () => {
    expect(
      calculateInstrumentationAmplifierGain({ rGainOhms: 494 })
        .instrumentationGain,
    ).toBe(101);
  });

  it("approaches unity gain for very large Rg", () => {
    expect(
      calculateInstrumentationAmplifierGain({ rGainOhms: 4940000 })
        .instrumentationGain,
    ).toBe(1.01);
  });

  it("accepts fractional gain resistor values", () => {
    expect(
      calculateInstrumentationAmplifierGain({ rGainOhms: 24700 })
        .instrumentationGain,
    ).toBe(3);
  });

  it("rejects zero gain resistance", () => {
    expect(runInstrumentationAmplifierGain({ rGainOhms: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_rg_ohms" }] },
      ok: false,
    });
  });

  it("rejects negative gain resistance", () => {
    expect(runInstrumentationAmplifierGain({ rGainOhms: -1000 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_rg_ohms" }] },
        ok: false,
      },
    );
  });
});
