import { describe, expect, it } from "vitest";
import {
  runOpampNoninvertingGain,
  opampNoninvertingGainExample,
} from "./tool.js";

describe("Non-Inverting Op-Amp Gain", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runOpampNoninvertingGain(opampNoninvertingGainExample.input),
    ).toEqual({
      ok: true,
      output: opampNoninvertingGainExample.output,
    }));
  it("returns unity gain for zero feedback resistance", () =>
    expect(
      runOpampNoninvertingGain({
        feedbackResistorOhms: 0,
        gainResistorOhms: 1000,
      }),
    ).toEqual({ ok: true, output: { closedLoopGain: 1 } }));
  it("doubles the signal for equal resistors", () =>
    expect(
      runOpampNoninvertingGain({
        feedbackResistorOhms: 3300,
        gainResistorOhms: 3300,
      }),
    ).toEqual({ ok: true, output: { closedLoopGain: 2 } }));
  it("scales with fractional resistor values", () =>
    expect(
      runOpampNoninvertingGain({
        feedbackResistorOhms: 4.7,
        gainResistorOhms: 1,
      }),
    ).toEqual({ ok: true, output: { closedLoopGain: 5.7 } }));
  it("rejects zero gain resistance with a stable code", () =>
    expect(
      runOpampNoninvertingGain({
        feedbackResistorOhms: 1000,
        gainResistorOhms: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "gainResistorOhms" }],
      },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runOpampNoninvertingGain({
        feedbackResistorOhms: Number.NaN,
        gainResistorOhms: 1000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "feedbackResistorOhms" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runOpampNoninvertingGain({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "feedbackResistorOhms" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runOpampNoninvertingGain({
        ...opampNoninvertingGainExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
