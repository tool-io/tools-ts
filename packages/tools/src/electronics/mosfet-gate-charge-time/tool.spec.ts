import { describe, expect, it } from "vitest";
import {
  mosfetGateChargeTimeExample,
  runMosfetGateChargeTime,
} from "./tool.js";
describe("Gate Charge Time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMosfetGateChargeTime(mosfetGateChargeTimeExample.input)).toEqual({
      ok: true,
      output: mosfetGateChargeTimeExample.output,
    });
  });
  it("divides gate charge by drive current", () => {
    expect(
      runMosfetGateChargeTime({ gateDriveCurrentA: 2, totalGateChargeNc: 30 }),
    ).toEqual({ ok: true, output: { gateChargeTimeNs: 15 } });
  });
  it("rejects invalid input", () => {
    expect(
      runMosfetGateChargeTime({ gateDriveCurrentA: -1, totalGateChargeNc: 30 })
        .ok,
    ).toBe(false);
  });
});
