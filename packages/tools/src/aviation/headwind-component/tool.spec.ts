import { describe, expect, it } from "vitest";
import {
  headwindComponentExample,
  runHeadwindComponent,
} from "./tool.js";

describe("headwind component calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHeadwindComponent(headwindComponentExample.input)).toEqual({
      ok: true,
      output: headwindComponentExample.output,
    });
  });

  it("returns negative values for tailwinds", () => {
    expect(
      runHeadwindComponent({ windAngleDeg: 180, windSpeedKt: 30 }),
    ).toEqual({ ok: true, output: { headwindKt: -30 } });
  });

  it("matches the cosine of the angle", () => {
    expect(
      runHeadwindComponent({ windAngleDeg: 60, windSpeedKt: 40 }),
    ).toEqual({ ok: true, output: { headwindKt: 20 } });
  });
});
