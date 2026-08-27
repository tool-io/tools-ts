import { describe, expect, it } from "vitest";
import {
  differentialInputVoltageExample,
  runDifferentialInputVoltage,
} from "./tool.js";
describe("Differential Input Voltage", () => {
  it("publishes an executable example", () =>
    expect(
      runDifferentialInputVoltage(differentialInputVoltageExample.input),
    ).toEqual({ ok: true, output: differentialInputVoltageExample.output }));
  it("keeps negative differentials signed", () =>
    expect(runDifferentialInputVoltage({ vPlus: 1, vMinus: 4 })).toEqual({
      ok: true,
      output: { differentialVoltageV: -3 },
    }));
  it("yields zero for equal inputs", () =>
    expect(runDifferentialInputVoltage({ vPlus: 2.5, vMinus: 2.5 })).toEqual({
      ok: true,
      output: { differentialVoltageV: 0 },
    }));
});
