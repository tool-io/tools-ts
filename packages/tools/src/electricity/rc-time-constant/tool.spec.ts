import { describe, expect, it } from "vitest";
import {
  rcTimeConstantExample,
  calculateRcTimeConstant,
  runRcTimeConstant,
} from "./tool.js";

describe("electricity/rc-time-constant", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRcTimeConstant(rcTimeConstantExample.input)).toEqual({
      ok: true,
      output: rcTimeConstantExample.output,
    });
  });
  it("rejects invalid input (invalid_resistance)", () => {
    expect(
      runRcTimeConstant({ resistanceOhms: 0, capacitanceFarads: 0.000001 }).ok,
    ).toBe(false);
  });
  it("rejects invalid input (invalid_capacitance)", () => {
    expect(
      runRcTimeConstant({ resistanceOhms: 100, capacitanceFarads: -1 }).ok,
    ).toBe(false);
  });
});
