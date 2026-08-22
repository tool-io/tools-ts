import { describe, expect, it } from "vitest";
import {
  gustPenetrationSpeedExample,
  runGustPenetrationSpeed,
} from "./tool.js";

describe("gust penetration speed calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGustPenetrationSpeed(gustPenetrationSpeedExample.input)).toEqual({
      ok: true,
      output: gustPenetrationSpeedExample.output,
    });
  });

  it("applies the one-point-nine ratio to any stall speed", () => {
    expect(runGustPenetrationSpeed({ stallingSpeedKt: 50 })).toEqual({
      ok: true,
      output: { gustPenetrationSpeedKt: 95 },
    });
    expect(runGustPenetrationSpeed({ stallingSpeedKt: 64 })).toEqual({
      ok: true,
      output: { gustPenetrationSpeedKt: 121.6 },
    });
  });

  it("keeps fractional stall speeds proportional", () => {
    const result = runGustPenetrationSpeed({
      stallingSpeedKt: 48.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gustPenetrationSpeedKt).toBeCloseTo(92.15, 9);
  });

  it("stays above the stall speed it derives from", () => {
    for (const stallingSpeedKt of [40, 55, 72]) {
      const result = runGustPenetrationSpeed({ stallingSpeedKt });
      if (!result.ok) throw new Error("expected success");
      expect(result.output.gustPenetrationSpeedKt).toBeGreaterThan(
        stallingSpeedKt,
      );
    }
  });

  it("rejects zero and negative stall speeds", () => {
    const zero = runGustPenetrationSpeed({ stallingSpeedKt: 0 });
    expect(zero.ok).toBe(false);
    if (!zero.ok)
      expect(zero.error.issues[0]?.code).toBe("invalid_stalling_speed");
    expect(runGustPenetrationSpeed({ stallingSpeedKt: -10 })).toMatchObject({
      ok: false,
    });
  });

  it("rejects missing and non-numeric inputs", () => {
    expect(runGustPenetrationSpeed({})).toMatchObject({ ok: false });
    expect(runGustPenetrationSpeed({ stallingSpeedKt: "slow" })).toMatchObject({
      ok: false,
    });
  });

  it("never returns an unknown output field", () => {
    const result = runGustPenetrationSpeed({ stallingSpeedKt: 100 });
    if (!result.ok) throw new Error("expected success");
    expect(Object.keys(result.output)).toEqual(["gustPenetrationSpeedKt"]);
  });
});
