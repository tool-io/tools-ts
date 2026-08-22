import { describe, expect, it } from "vitest";
import { trueHeadingExample, runTrueHeading } from "./tool.js";

describe("true heading calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTrueHeading(trueHeadingExample.input)).toEqual({
      ok: true,
      output: trueHeadingExample.output,
    });
  });

  it("wraps past north for east variations near 360", () => {
    expect(
      runTrueHeading({ magneticHeadingDeg: 355, variationDeg: 10 }),
    ).toEqual({ ok: true, output: { trueHeadingDeg: 5 } });
  });

  it("round-trips with the magnetic heading calculator", async () => {
    const { runMagneticHeading } = await import("../magnetic-heading/tool.js");
    for (const [heading, variation] of [
      [10, 15],
      [350, -20],
      [180, 8],
    ]) {
      const magnetic = runMagneticHeading({
        trueHeadingDeg: heading,
        variationDeg: variation,
      });
      if (!magnetic.ok) throw new Error("expected success");
      const back = runTrueHeading({
        magneticHeadingDeg: magnetic.output.magneticHeadingDeg,
        variationDeg: variation,
      });
      expect(back).toEqual({
        ok: true,
        output: { trueHeadingDeg: ((heading % 360) + 360) % 360 },
      });
    }
  });
});
