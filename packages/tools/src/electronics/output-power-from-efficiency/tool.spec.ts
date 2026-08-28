import { describe, expect, it } from "vitest";
import {
  runOutputPowerFromEfficiency,
  outputPowerFromEfficiencyExample,
} from "./tool.js";

describe("Output Power From Efficiency", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runOutputPowerFromEfficiency(outputPowerFromEfficiencyExample.input),
    ).toEqual({ ok: true, output: outputPowerFromEfficiencyExample.output }));
  it("delivers half the input at fifty percent efficiency", () =>
    expect(
      runOutputPowerFromEfficiency({
        efficiencyPercent: 50,
        inputPowerWatts: 40,
      }),
    ).toEqual({ ok: true, output: { outputPowerWatts: 20 } }));
  it("delivers zero output at zero percent efficiency", () =>
    expect(
      runOutputPowerFromEfficiency({
        efficiencyPercent: 0,
        inputPowerWatts: 40,
      }),
    ).toEqual({ ok: true, output: { outputPowerWatts: 0 } }));
  it("computes a fractional delivery", () =>
    expect(
      runOutputPowerFromEfficiency({
        efficiencyPercent: 92,
        inputPowerWatts: 25,
      }),
    ).toEqual({ ok: true, output: { outputPowerWatts: 23 } }));
  it("rejects efficiency above one hundred percent", () =>
    expect(
      runOutputPowerFromEfficiency({
        efficiencyPercent: 101,
        inputPowerWatts: 40,
      }).ok,
    ).toBe(false));
  it("rejects negative input power", () =>
    expect(
      runOutputPowerFromEfficiency({
        efficiencyPercent: 80,
        inputPowerWatts: -1,
      }).ok,
    ).toBe(false));
  it("rejects non-finite input", () =>
    expect(
      runOutputPowerFromEfficiency({
        efficiencyPercent: Number.POSITIVE_INFINITY,
        inputPowerWatts: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "efficiencyPercent" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runOutputPowerFromEfficiency({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "efficiencyPercent" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runOutputPowerFromEfficiency({
        ...outputPowerFromEfficiencyExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
