import { describe, expect, it } from "vitest";
import {
  calculateStallSpeedInBank,
  runStallSpeedInBank,
  stallSpeedBankExample,
} from "./tool.js";

describe("stall speed in bank calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runStallSpeedInBank(stallSpeedBankExample.input)).toEqual({
      ok: true,
      output: stallSpeedBankExample.output,
    });
  });

  it("keeps the level stall speed without bank", () => {
    expect(
      calculateStallSpeedInBank({ bankAngleDeg: 0, levelStallSpeedKt: 55 }),
    ).toEqual({
      stallSpeedKt: 55,
    });
  });

  it("rejects ninety-degree banks through execution", () => {
    expect(
      runStallSpeedInBank({ bankAngleDeg: 90, levelStallSpeedKt: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "undefined_stall_speed" }] },
      ok: false,
    });
  });
});
