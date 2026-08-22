import { describe, expect, it } from "vitest";
import { magneticHeadingExample, runMagneticHeading } from "./tool.js";

describe("magnetic heading calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMagneticHeading(magneticHeadingExample.input)).toEqual({
      ok: true,
      output: magneticHeadingExample.output,
    });
  });

  it("wraps below zero into the 360 range for west variation", () => {
    expect(
      runMagneticHeading({ trueHeadingDeg: 10, variationDeg: -20 }),
    ).toEqual({ ok: true, output: { magneticHeadingDeg: 30 } });
  });

  it("subtracts east variation from the true heading", () => {
    expect(
      runMagneticHeading({ trueHeadingDeg: 5, variationDeg: -10 }),
    ).toEqual({
      ok: true,
      output: { magneticHeadingDeg: 15 },
    });
  });
});
