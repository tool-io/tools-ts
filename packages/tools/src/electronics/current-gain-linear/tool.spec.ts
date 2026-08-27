import { describe, expect, it } from "vitest";
import { runCurrentGainLinear, currentGainLinearExample } from "./tool.js";

describe("Current Gain Linear", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runCurrentGainLinear(currentGainLinearExample.input)).toEqual({
      ok: true,
      output: currentGainLinearExample.output,
    }));
  it("reports unity gain for equal currents", () =>
    expect(
      runCurrentGainLinear({ inputCurrentAmps: 0.02, outputCurrentAmps: 0.02 }),
    ).toEqual({ ok: true, output: { currentGain: 1 } }));
  it("reports beta for a transistor stage", () =>
    expect(
      runCurrentGainLinear({
        inputCurrentAmps: 0.00002,
        outputCurrentAmps: 0.002,
      }),
    ).toEqual({ ok: true, output: { currentGain: 100 } }));
  it("rejects zero input current with a stable code", () =>
    expect(
      runCurrentGainLinear({ inputCurrentAmps: 0, outputCurrentAmps: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "inputCurrentAmps" }],
      },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runCurrentGainLinear({
        inputCurrentAmps: 0.01,
        outputCurrentAmps: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "outputCurrentAmps" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runCurrentGainLinear({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputCurrentAmps" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runCurrentGainLinear({
        ...currentGainLinearExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
