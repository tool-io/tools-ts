import { describe, expect, it } from "vitest";
import { commonModeVoltageExample, runCommonModeVoltage } from "./tool.js";
describe("Common Mode Voltage", () => {
  it("publishes an executable example", () =>
    expect(runCommonModeVoltage(commonModeVoltageExample.input)).toEqual({
      ok: true,
      output: commonModeVoltageExample.output,
    }));
  it("keeps negative levels signed", () =>
    expect(runCommonModeVoltage({ vPlus: -1, vMinus: -3 })).toEqual({
      ok: true,
      output: { commonModeVoltageV: -2 },
    }));
  it("matches either input when equal", () =>
    expect(runCommonModeVoltage({ vPlus: 7, vMinus: 7 })).toEqual({
      ok: true,
      output: { commonModeVoltageV: 7 },
    }));
});
