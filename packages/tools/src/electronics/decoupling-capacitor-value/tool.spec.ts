import { describe, expect, it } from "vitest";
import {
  decouplingCapacitorValueExample,
  runDecouplingCapacitorValue,
} from "./tool.js";

describe("Decoupling Cap Value", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runDecouplingCapacitorValue(decouplingCapacitorValueExample.input),
    ).toEqual({ ok: true, output: decouplingCapacitorValueExample.output }));

  it("doubles the required capacitance when the transient current doubles", () =>
    expect(
      runDecouplingCapacitorValue({
        allowedDroopTimeNs: 100,
        allowedDroopVolts: 0.3,
        transientCurrentA: 2,
      }),
    ).toEqual({
      ok: true,
      output: { decouplingCapacitanceUf: 0.6666666666666667 },
    }));

  it("halves the required capacitance when the allowed droop doubles", () =>
    expect(
      runDecouplingCapacitorValue({
        allowedDroopTimeNs: 100,
        allowedDroopVolts: 0.6,
        transientCurrentA: 1,
      }),
    ).toEqual({
      ok: true,
      output: { decouplingCapacitanceUf: 0.16666666666666669 },
    }));

  it("scales linearly with the droop time", () => {
    const short = runDecouplingCapacitorValue({
      allowedDroopTimeNs: 50,
      allowedDroopVolts: 0.5,
      transientCurrentA: 1,
    });
    const long = runDecouplingCapacitorValue({
      allowedDroopTimeNs: 500,
      allowedDroopVolts: 0.5,
      transientCurrentA: 1,
    });
    if (!short.ok || !long.ok) throw new Error("expected success");
    expect(long.output.decouplingCapacitanceUf).toBeGreaterThan(
      Number(short.output.decouplingCapacitanceUf),
    );
  });

  it("rejects a non-positive transient current", () =>
    expect(
      runDecouplingCapacitorValue({
        allowedDroopTimeNs: 100,
        allowedDroopVolts: 0.3,
        transientCurrentA: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "transientCurrentA" }],
      },
      ok: false,
    }));

  it("rejects a non-positive droop time", () =>
    expect(
      runDecouplingCapacitorValue({
        allowedDroopTimeNs: -10,
        allowedDroopVolts: 0.3,
        transientCurrentA: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_time", field: "allowedDroopTimeNs" }],
      },
      ok: false,
    }));

  it("rejects a non-positive droop voltage", () =>
    expect(
      runDecouplingCapacitorValue({
        allowedDroopTimeNs: 100,
        allowedDroopVolts: 0,
        transientCurrentA: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_voltage", field: "allowedDroopVolts" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runDecouplingCapacitorValue(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
