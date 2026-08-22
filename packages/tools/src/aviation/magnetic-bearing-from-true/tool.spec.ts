import { describe, expect, it } from "vitest";
import {
  magneticBearingFromTrueExample,
  runMagneticBearingFromTrue,
} from "./tool.js";

describe("magnetic bearing from true calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMagneticBearingFromTrue(magneticBearingFromTrueExample.input),
    ).toEqual({
      ok: true,
      output: magneticBearingFromTrueExample.output,
    });
  });

  it("subtracts east variation without wrapping", () => {
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 112, variationDeg: 12 }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 100 } });
  });

  it("adds west variation", () => {
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 88, variationDeg: -12 }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 100 } });
  });

  it("wraps below zero for east variation near north", () => {
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 5, variationDeg: 10 }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 355 } });
  });

  it("wraps past north for west variation near 360", () => {
    expect(
      runMagneticBearingFromTrue({
        trueBearingDeg: 350,
        variationDeg: -20,
      }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 10 } });
  });

  it("leaves bearings unchanged with zero variation", () => {
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 274, variationDeg: 0 }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 274 } });
  });

  it("handles the maximum bearing and extreme variations", () => {
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 360, variationDeg: 180 }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 180 } });
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 0, variationDeg: -180 }),
    ).toEqual({ ok: true, output: { magneticBearingDeg: 180 } });
  });

  it("round-trips with the true bearing calculator", async () => {
    const { runTrueBearingFromMagnetic } =
      await import("../true-bearing-from-magnetic/tool.js");
    for (const [bearing, variation] of [
      [10, 20],
      [200, -95],
      [359, 179],
    ]) {
      const magnetic = runMagneticBearingFromTrue({
        trueBearingDeg: bearing,
        variationDeg: variation,
      });
      if (!magnetic.ok) throw new Error("expected success");
      const back = runTrueBearingFromMagnetic({
        magneticBearingDeg: magnetic.output.magneticBearingDeg,
        variationDeg: variation,
      });
      if (!back.ok) throw new Error("expected success");
      expect(back.output.trueBearingDeg).toBe(((bearing % 360) + 360) % 360);
    }
  });

  it("rejects out-of-range bearings and variations", () => {
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: -1, variationDeg: 10 }),
    ).toMatchObject({ ok: false });
    expect(
      runMagneticBearingFromTrue({ trueBearingDeg: 90, variationDeg: -181 }),
    ).toMatchObject({ ok: false });
    expect(runMagneticBearingFromTrue({ trueBearingDeg: 90 })).toMatchObject({
      ok: false,
    });
  });
});
