import { describe, expect, it } from "vitest";
import { reserveRecoverableExample, runReserveRecoverable } from "./tool.js";

describe("reserve-recoverable", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReserveRecoverable(reserveRecoverableExample.input)).toEqual({
      ok: true,
      output: reserveRecoverableExample.output,
    });
  });

  it("recovers everything at a unit recovery factor", () => {
    const result = runReserveRecoverable({
      originalOilInPlaceSm3: 1000,
      recoveryFactor: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.recoverableReservesSm3 as number).toBe(1000);
  });
  it("rejects out-of-range recovery factors", () => {
    expect(
      runReserveRecoverable({
        originalOilInPlaceSm3: 1000,
        recoveryFactor: 1.2,
      }).ok,
    ).toBe(false);
  });
});
