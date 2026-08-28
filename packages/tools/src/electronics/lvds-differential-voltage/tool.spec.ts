import { describe, expect, it } from "vitest";
import { runLvdsDifferentialVoltage } from "./tool.js";
describe("LVDS Swing Check", () => {
  it("accepts the typical swing", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 350 })).toEqual({
      ok: true,
      output: { withinSpec: true },
    }));
  it("accepts the lower limit inclusively", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 247 })).toEqual({
      ok: true,
      output: { withinSpec: true },
    }));
  it("rejects just below the lower limit", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 246.5 })).toEqual({
      ok: true,
      output: { withinSpec: false },
    }));
  it("accepts the upper limit inclusively", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 454 })).toEqual({
      ok: true,
      output: { withinSpec: true },
    }));
  it("rejects just above the upper limit", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 454.5 })).toEqual({
      ok: true,
      output: { withinSpec: false },
    }));
  it("flags zero swing as out of spec", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 0 })).toEqual({
      ok: true,
      output: { withinSpec: false },
    }));
  it("rejects swings beyond the input range", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: 1000.5 }).ok).toBe(
      false,
    ));
  it("rejects negative swings", () =>
    expect(runLvdsDifferentialVoltage({ differentialSwingMv: -350 }).ok).toBe(
      false,
    ));
});
