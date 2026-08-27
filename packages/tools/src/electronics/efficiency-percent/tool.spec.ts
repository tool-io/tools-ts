import { describe, expect, it } from "vitest";
import { runEfficiencyPercent, efficiencyPercentExample } from "./tool.js";

describe("Efficiency Percent", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runEfficiencyPercent(efficiencyPercentExample.input)).toEqual({
      ok: true,
      output: efficiencyPercentExample.output,
    }));
  it("reports one hundred percent for an ideal converter", () =>
    expect(
      runEfficiencyPercent({ inputPowerWatts: 5, outputPowerWatts: 5 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 100 } }));
  it("reports zero percent for no output power", () =>
    expect(
      runEfficiencyPercent({ inputPowerWatts: 5, outputPowerWatts: 0 }),
    ).toEqual({ ok: true, output: { efficiencyPercent: 0 } }));
  it("computes a switching regulator efficiency", () =>
    expect(
      runEfficiencyPercent({ inputPowerWatts: 12, outputPowerWatts: 10.2 }),
    ).toEqual({
      ok: true,
      output: { efficiencyPercent: 85 },
    }));
  it("rejects zero input power with a stable code", () =>
    expect(
      runEfficiencyPercent({ inputPowerWatts: 0, outputPowerWatts: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects negative output power with a stable code", () =>
    expect(
      runEfficiencyPercent({ inputPowerWatts: 10, outputPowerWatts: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "outputPowerWatts" }] },
      ok: false,
    }));
  it("rejects output above input with a stable code", () =>
    expect(
      runEfficiencyPercent({ inputPowerWatts: 10, outputPowerWatts: 11 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "outputPowerWatts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runEfficiencyPercent({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runEfficiencyPercent({
        ...efficiencyPercentExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
