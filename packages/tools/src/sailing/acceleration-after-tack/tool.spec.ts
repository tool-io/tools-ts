import { describe, expect, it } from "vitest";
import {
  accelerationAfterTackExample,
  calculateAccelerationAfterTack,
  runAccelerationAfterTack,
} from "./tool.js";

describe("Post-Tack Acceleration Time", () => {
  it("publishes an executable example", () =>
    expect(
      runAccelerationAfterTack(accelerationAfterTackExample.input),
    ).toEqual({
      ok: true,
      output: accelerationAfterTackExample.output,
    }));

  it("applies the default rate of 0.3 knots per second", () =>
    expect(runAccelerationAfterTack({ speedDeficitKt: 3 })).toEqual({
      ok: true,
      output: { recoverySeconds: 10 },
    }));

  it("honours an explicit acceleration rate", () =>
    expect(
      runAccelerationAfterTack({
        speedDeficitKt: 3,
        accelerationRateKtPerSecond: 0.6,
      }),
    ).toEqual({
      ok: true,
      output: { recoverySeconds: 5 },
    }));

  it("needs no recovery time for a zero deficit", () =>
    expect(runAccelerationAfterTack({ speedDeficitKt: 0 })).toEqual({
      ok: true,
      output: { recoverySeconds: 0 },
    }));

  it("halves the recovery time when the rate doubles", () => {
    const base = calculateAccelerationAfterTack({
      speedDeficitKt: 2,
      accelerationRateKtPerSecond: 0.5,
    });
    const doubled = calculateAccelerationAfterTack({
      speedDeficitKt: 2,
      accelerationRateKtPerSecond: 1,
    });
    expect(doubled.recoverySeconds).toBe(base.recoverySeconds / 2);
  });

  it("accepts deficits and rates just inside the boundaries", () => {
    expect(
      runAccelerationAfterTack({
        speedDeficitKt: 1,
        accelerationRateKtPerSecond: 0.001,
      }).ok,
    ).toBe(true);
    expect(
      runAccelerationAfterTack({
        speedDeficitKt: 1,
        accelerationRateKtPerSecond: 1.999,
      }).ok,
    ).toBe(true);
  });

  it("rejects a zero rate with invalid_rate", () => {
    for (const accelerationRateKtPerSecond of [0]) {
      const result = runAccelerationAfterTack({
        accelerationRateKtPerSecond,
        speedDeficitKt: 1,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_rate");
    }
  });

  it("rejects negative deficits and rates", () => {
    expect(runAccelerationAfterTack({ speedDeficitKt: -1 }).ok).toBe(false);
    expect(
      runAccelerationAfterTack({
        speedDeficitKt: 1,
        accelerationRateKtPerSecond: -0.1,
      }).ok,
    ).toBe(false);
    expect(
      runAccelerationAfterTack({
        accelerationRateKtPerSecond: 2.5,
        speedDeficitKt: 1,
      }).ok,
    ).toBe(true);
  });

  it("rejects non-finite and malformed input", () => {
    expect(runAccelerationAfterTack({ speedDeficitKt: Number.NaN }).ok).toBe(
      false,
    );
    expect(runAccelerationAfterTack({}).ok).toBe(false);
  });
});
