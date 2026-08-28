import { describe, expect, it } from "vitest";
import { runPowerGainLinear, powerGainLinearExample } from "./tool.js";

describe("Linear Power Gain", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPowerGainLinear(powerGainLinearExample.input)).toEqual({
      ok: true,
      output: powerGainLinearExample.output,
    }));
  it("reports unity gain for equal powers", () =>
    expect(
      runPowerGainLinear({ inputPowerWatts: 2, outputPowerWatts: 2 }),
    ).toEqual({
      ok: true,
      output: { powerGain: 1 },
    }));
  it("reports fractional gain for an attenuator", () =>
    expect(
      runPowerGainLinear({ inputPowerWatts: 8, outputPowerWatts: 2 }),
    ).toEqual({
      ok: true,
      output: { powerGain: 0.25 },
    }));
  it("rejects zero input power because the ratio is not finite", () =>
    expect(
      runPowerGainLinear({ inputPowerWatts: 0, outputPowerWatts: 1 }).ok,
    ).toBe(false));
  it("rejects negative output power", () =>
    expect(
      runPowerGainLinear({ inputPowerWatts: 1, outputPowerWatts: -1 }).ok,
    ).toBe(false));
  it("rejects non-finite input", () =>
    expect(
      runPowerGainLinear({
        inputPowerWatts: Number.NaN,
        outputPowerWatts: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runPowerGainLinear({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runPowerGainLinear({
        ...powerGainLinearExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
