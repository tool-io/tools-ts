import { describe, expect, it } from "vitest";
import {
  calculateLogicThresholdCmos,
  logicThresholdCmosExample,
  runLogicThresholdCmos,
} from "./tool.js";

describe("CMOS Thresholds", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLogicThresholdCmos(logicThresholdCmosExample.input)).toEqual({
      ok: true,
      output: logicThresholdCmosExample.output,
    });
  });

  it("scales thresholds at 0.7 and 0.3 of the supply", () => {
    const { vihMinV, vilMaxV } = calculateLogicThresholdCmos({ vddVolts: 3.3 });
    expect(vihMinV).toBeCloseTo(2.31);
    expect(vilMaxV).toBeCloseTo(0.99);
  });

  it("keeps the input threshold band symmetric around mid-supply", () => {
    const { vihMinV, vilMaxV } = calculateLogicThresholdCmos({ vddVolts: 1.8 });
    expect(vihMinV - 0.9).toBeCloseTo(0.9 - vilMaxV);
  });

  it("matches the classic TTL-compatible five volt band", () => {
    expect(calculateLogicThresholdCmos({ vddVolts: 5 })).toEqual({
      vihMinV: 3.5,
      vilMaxV: 1.5,
    });
  });

  it("handles sub-volt supplies", () => {
    const { vihMinV, vilMaxV } = calculateLogicThresholdCmos({ vddVolts: 0.5 });
    expect(vihMinV).toBeCloseTo(0.35);
    expect(vilMaxV).toBeCloseTo(0.15);
  });

  it("rejects a zero supply voltage", () => {
    expect(runLogicThresholdCmos({ vddVolts: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_vdd" }] },
      ok: false,
    });
  });

  it("rejects a negative supply voltage", () => {
    expect(runLogicThresholdCmos({ vddVolts: -5 })).toMatchObject({
      error: { issues: [{ code: "invalid_vdd" }] },
      ok: false,
    });
  });
});
