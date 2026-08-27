import { describe, expect, it } from "vitest";
import { recoveryFactorExample, runRecoveryFactor } from "./tool.js";

describe("recovery-factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRecoveryFactor(recoveryFactorExample.input)).toEqual({
      ok: true,
      output: recoveryFactorExample.output,
    });
  });

  it("returns one when everything has been produced", () => {
    const result = runRecoveryFactor({
      producedVolumeSm3: 500,
      originalOilInPlaceSm3: 500,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.recoveryFactor as number).toBe(1);
  });
  it("rejects non-positive oil in place", () => {
    expect(
      runRecoveryFactor({ producedVolumeSm3: 1, originalOilInPlaceSm3: 0 }).ok,
    ).toBe(false);
  });
});
