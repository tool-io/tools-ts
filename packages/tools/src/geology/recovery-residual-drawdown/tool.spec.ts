import { describe, expect, it } from "vitest";
import {
  recoveryResidualDrawdownExample,
  runRecoveryResidualDrawdown,
} from "./tool.js";

describe("recovery-residual-drawdown", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRecoveryResidualDrawdown(recoveryResidualDrawdownExample.input),
    ).toEqual({
      ok: true,
      output: recoveryResidualDrawdownExample.output,
    });
  });

  it("returns zero residual drawdown when recovery time equals pumping duration", () => {
    const result = runRecoveryResidualDrawdown({
      dischargeM3PerDay: 800,
      transmissivityM2PerDay: 150,
      pumpingDurationDays: 1,
      recoveryElapsedDays: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.residualDrawdownM as number).toBe(0);
  });

  it("rejects non-positive recovery elapsed time", () => {
    expect(
      runRecoveryResidualDrawdown({
        dischargeM3PerDay: 800,
        transmissivityM2PerDay: 150,
        pumpingDurationDays: 1,
        recoveryElapsedDays: 0,
      }).ok,
    ).toBe(false);
  });
});
