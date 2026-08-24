import { describe, expect, it } from "vitest";
import { fillFactorExample, runFillFactor } from "./tool.js";

describe("ideal solar-cell fill factor", () => {
  it("reproduces the documented example", () =>
    expect(runFillFactor(fillFactorExample.input)).toEqual({
      ok: true,
      output: fillFactorExample.output,
    }));
  it("uses temperature and ideality in normalized voltage", () =>
    expect(
      runFillFactor({
        idealityFactor: 2,
        openCircuitVoltage: 1.2,
        temperatureKelvin: 300,
      }),
    ).toEqual({ ok: true, output: fillFactorExample.output }));
  it("rejects use outside the approximation range", () =>
    expect(runFillFactor({ openCircuitVoltage: 0.1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "outside_model_range" }] },
    }));
});
