import { describe, expect, it } from "vitest";
import { crosswindLimitCheckExample, runCrosswindLimitCheck } from "./tool.js";

describe("crosswind limit checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrosswindLimitCheck(crosswindLimitCheckExample.input)).toEqual({
      ok: true,
      output: crosswindLimitCheckExample.output,
    });
  });

  it("flags exceedances with negative margin", () => {
    expect(
      runCrosswindLimitCheck({
        crosswindKt: 25,
        maxDemonstratedCrosswindKt: 20,
      }),
    ).toEqual({ ok: true, output: { marginKt: -5, withinLimits: false } });
  });

  it("treats the exact limit as within limits", () => {
    expect(
      runCrosswindLimitCheck({
        crosswindKt: 20,
        maxDemonstratedCrosswindKt: 20,
      }),
    ).toMatchObject({ ok: true, output: { marginKt: 0, withinLimits: true } });
  });
});
