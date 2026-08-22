import { describe, expect, it } from "vitest";
import {
  trueBearingFromMagneticExample,
  runTrueBearingFromMagnetic,
} from "./tool.js";

describe("true bearing from magnetic calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTrueBearingFromMagnetic(trueBearingFromMagneticExample.input),
    ).toEqual({
      ok: true,
      output: trueBearingFromMagneticExample.output,
    });
  });

  it("adds east variation without wrapping", () => {
    expect(
      runTrueBearingFromMagnetic({ magneticBearingDeg: 100, variationDeg: 12 }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 112 } });
  });

  it("subtracts west variation", () => {
    expect(
      runTrueBearingFromMagnetic({
        magneticBearingDeg: 100,
        variationDeg: -12,
      }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 88 } });
  });

  it("wraps past north for east variation near 360", () => {
    expect(
      runTrueBearingFromMagnetic({ magneticBearingDeg: 355, variationDeg: 10 }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 5 } });
  });

  it("wraps below zero for west variation near north", () => {
    expect(
      runTrueBearingFromMagnetic({ magneticBearingDeg: 10, variationDeg: -20 }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 350 } });
  });

  it("leaves bearings unchanged with zero variation", () => {
    expect(
      runTrueBearingFromMagnetic({ magneticBearingDeg: 274, variationDeg: 0 }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 274 } });
  });

  it("handles the maximum bearing and extreme variations", () => {
    expect(
      runTrueBearingFromMagnetic({
        magneticBearingDeg: 360,
        variationDeg: -180,
      }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 180 } });
    expect(
      runTrueBearingFromMagnetic({ magneticBearingDeg: 0, variationDeg: 180 }),
    ).toEqual({ ok: true, output: { trueBearingDeg: 180 } });
  });

  it("round-trips with the magnetic bearing calculator", async () => {
    const { runMagneticBearingFromTrue } =
      await import("../magnetic-bearing-from-true/tool.js");
    for (const [bearing, variation] of [
      [350, 20],
      [45, -105],
      [180, 8],
    ]) {
      const trueBearing = runTrueBearingFromMagnetic({
        magneticBearingDeg: bearing,
        variationDeg: variation,
      });
      if (!trueBearing.ok) throw new Error("expected success");
      const back = runMagneticBearingFromTrue({
        trueBearingDeg: trueBearing.output.trueBearingDeg,
        variationDeg: variation,
      });
      if (!back.ok) throw new Error("expected success");
      expect(back.output.magneticBearingDeg).toBe(
        ((bearing % 360) + 360) % 360,
      );
    }
  });

  it("rejects out-of-range bearings and variations", () => {
    expect(
      runTrueBearingFromMagnetic({ magneticBearingDeg: 361, variationDeg: 10 }),
    ).toMatchObject({ ok: false });
    expect(
      runTrueBearingFromMagnetic({
        magneticBearingDeg: 90,
        variationDeg: 181,
      }),
    ).toMatchObject({ ok: false });
    expect(runTrueBearingFromMagnetic({ variationDeg: 10 })).toMatchObject({
      ok: false,
    });
  });
});
