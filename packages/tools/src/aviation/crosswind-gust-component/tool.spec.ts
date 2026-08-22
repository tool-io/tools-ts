import { describe, expect, it } from "vitest";
import {
  crosswindGustComponentExample,
  runCrosswindGustComponent,
} from "./tool.js";

describe("crosswind gust component calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCrosswindGustComponent(crosswindGustComponentExample.input),
    ).toEqual({
      ok: true,
      output: crosswindGustComponentExample.output,
    });
  });
  it("is zero for a gust straight down the runway", () => {
    const result = runCrosswindGustComponent({ gustAngleDeg: 0, gustKt: 30 });
    if (!result.ok) throw new Error("expected success");
    expect(
      (result.output as { crosswindGustKt: number }).crosswindGustKt,
    ).toBeCloseTo(0, 9);
  });
});
