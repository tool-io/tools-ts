import { describe, expect, it } from "vitest";
import {
  crosswindComponentExample,
  runCrosswindComponent,
} from "./tool.js";

describe("crosswind component calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCrosswindComponent(crosswindComponentExample.input)).toEqual({
      ok: true,
      output: crosswindComponentExample.output,
    });
  });

  it("reports magnitude regardless of wind side", () => {
    for (const windAngleDeg of [45, -45, 135, -135]) {
      const result = runCrosswindComponent({ windAngleDeg, windSpeedKt: 20 });
      if (!result.ok) throw new Error("expected success");
      expect(result.output.crosswindKt).toBeCloseTo(
        Math.abs(20 * Math.sin((windAngleDeg * Math.PI) / 180)),
        9,
      );
    }
  });

  it("is zero for headwinds and tailwinds", () => {
    for (const windAngleDeg of [0, 180]) {
      expect(
        runCrosswindComponent({ windAngleDeg, windSpeedKt: 25 }),
      ).toEqual({ ok: true, output: { crosswindKt: 0 } });
    }
  });
});
