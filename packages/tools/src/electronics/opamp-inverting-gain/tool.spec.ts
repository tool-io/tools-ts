import { describe, expect, it } from "vitest";
import { runOpampInvertingGain, opampInvertingGainExample } from "./tool.js";

describe("Inverting Op-Amp Gain", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runOpampInvertingGain(opampInvertingGainExample.input)).toEqual({
      ok: true,
      output: opampInvertingGainExample.output,
    }));
  it("returns unity magnitude for equal resistors", () =>
    expect(
      runOpampInvertingGain({
        feedbackResistorOhms: 4700,
        inputResistorOhms: 4700,
      }),
    ).toEqual({ ok: true, output: { closedLoopGain: -1 } }));
  it("attenuates when the feedback resistor is smaller", () =>
    expect(
      runOpampInvertingGain({
        feedbackResistorOhms: 1000,
        inputResistorOhms: 10000,
      }),
    ).toEqual({ ok: true, output: { closedLoopGain: -0.1 } }));
  it("scales with fractional resistor values", () =>
    expect(
      runOpampInvertingGain({
        feedbackResistorOhms: 2.2,
        inputResistorOhms: 0.1,
      }),
    ).toEqual({ ok: true, output: { closedLoopGain: -22 } }));
  it("rejects zero feedback resistance with a stable code", () =>
    expect(
      runOpampInvertingGain({
        feedbackResistorOhms: 0,
        inputResistorOhms: 1000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "feedbackResistorOhms" }],
      },
      ok: false,
    }));
  it("rejects negative input resistance with a stable code", () =>
    expect(
      runOpampInvertingGain({
        feedbackResistorOhms: 1000,
        inputResistorOhms: -1000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "inputResistorOhms" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runOpampInvertingGain({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "feedbackResistorOhms" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runOpampInvertingGain({
        ...opampInvertingGainExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
