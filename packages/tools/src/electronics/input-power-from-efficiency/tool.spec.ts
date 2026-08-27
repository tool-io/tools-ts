import { describe, expect, it } from "vitest";
import {
  runInputPowerFromEfficiency,
  inputPowerFromEfficiencyExample,
} from "./tool.js";

describe("Input Power From Efficiency", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runInputPowerFromEfficiency(inputPowerFromEfficiencyExample.input),
    ).toEqual({ ok: true, output: inputPowerFromEfficiencyExample.output }));
  it("requires double the input at fifty percent efficiency", () =>
    expect(
      runInputPowerFromEfficiency({
        efficiencyPercent: 50,
        outputPowerWatts: 30,
      }),
    ).toEqual({ ok: true, output: { inputPowerWatts: 60 } }));
  it("computes a fractional draw", () =>
    expect(
      runInputPowerFromEfficiency({
        efficiencyPercent: 90,
        outputPowerWatts: 4.5,
      }),
    ).toEqual({ ok: true, output: { inputPowerWatts: 5 } }));
  it("rejects zero efficiency with a stable code", () =>
    expect(
      runInputPowerFromEfficiency({
        efficiencyPercent: 0,
        outputPowerWatts: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_percent", field: "efficiencyPercent" }],
      },
      ok: false,
    }));
  it("rejects one hundred percent efficiency with a stable code", () =>
    expect(
      runInputPowerFromEfficiency({
        efficiencyPercent: 100,
        outputPowerWatts: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_percent", field: "efficiencyPercent" }],
      },
      ok: false,
    }));
  it("rejects negative efficiency with a stable code", () =>
    expect(
      runInputPowerFromEfficiency({
        efficiencyPercent: -5,
        outputPowerWatts: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_percent", field: "efficiencyPercent" }],
      },
      ok: false,
    }));
  it("rejects zero output power with a stable code", () =>
    expect(
      runInputPowerFromEfficiency({
        efficiencyPercent: 50,
        outputPowerWatts: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "outputPowerWatts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runInputPowerFromEfficiency({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "efficiencyPercent" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runInputPowerFromEfficiency({
        ...inputPowerFromEfficiencyExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
