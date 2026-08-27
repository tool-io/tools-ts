import { describe, expect, it } from "vitest";
import { bootstrapCapacitorExample, runBootstrapCapacitor } from "./tool.js";

describe("Bootstrap Capacitor", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runBootstrapCapacitor(bootstrapCapacitorExample.input)).toEqual({
      ok: true,
      output: bootstrapCapacitorExample.output,
    }));

  it("applies the ten-times-Qg-over-droop rule", () =>
    expect(
      runBootstrapCapacitor({ allowedDropV: 0.5, totalGateChargeNc: 10 }),
    ).toEqual({ ok: true, output: { bootstrapCapacitanceUf: 0.2 } }));

  it("doubles the capacitance when the allowed droop halves", () =>
    expect(
      runBootstrapCapacitor({ allowedDropV: 0.25, totalGateChargeNc: 10 }),
    ).toEqual({ ok: true, output: { bootstrapCapacitanceUf: 0.4 } }));

  it("scales linearly with the gate charge", () => {
    const small = runBootstrapCapacitor({
      allowedDropV: 1,
      totalGateChargeNc: 30,
    });
    const large = runBootstrapCapacitor({
      allowedDropV: 1,
      totalGateChargeNc: 60,
    });
    if (!small.ok || !large.ok) throw new Error("expected success");
    expect(large.output.bootstrapCapacitanceUf).toBeCloseTo(
      Number(small.output.bootstrapCapacitanceUf) * 2,
      12,
    );
  });

  it("rejects a non-positive gate charge", () =>
    expect(
      runBootstrapCapacitor({ allowedDropV: 0.5, totalGateChargeNc: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_charge", field: "totalGateChargeNc" }],
      },
      ok: false,
    }));

  it("rejects a non-positive droop voltage", () =>
    expect(
      runBootstrapCapacitor({ allowedDropV: -0.5, totalGateChargeNc: 20 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "allowedDropV" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runBootstrapCapacitor(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
