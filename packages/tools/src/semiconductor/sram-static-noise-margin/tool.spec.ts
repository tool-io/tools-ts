import { describe, expect, it } from "vitest";
import {
  runSramStaticNoiseMargin,
  sramStaticNoiseMarginExample,
} from "./tool.js";

describe("SRAM static noise margin", () => {
  it("reproduces the documented VTC example", () =>
    expect(
      runSramStaticNoiseMargin(sramStaticNoiseMarginExample.input),
    ).toEqual({ ok: true, output: sramStaticNoiseMarginExample.output }));
  it("uses the smaller of low and high margins", () =>
    expect(
      runSramStaticNoiseMargin({
        inputHighMinVolts: 0.7,
        inputLowMaxVolts: 0.35,
        outputHighMinVolts: 1.1,
        outputLowMaxVolts: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: {
        highNoiseMarginVolts: 0.40000000000000013,
        lowNoiseMarginVolts: 0.24999999999999997,
        staticNoiseMarginVolts: 0.24999999999999997,
      },
    }));
  it("rejects overlapping invalid logic levels", () =>
    expect(
      runSramStaticNoiseMargin({
        inputHighMinVolts: 0.8,
        inputLowMaxVolts: 0.1,
        outputHighMinVolts: 1,
        outputLowMaxVolts: 0.2,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_low_levels" }] },
    }));
});
