import { describe, expect, it } from "vitest";
import {
  calculateResistorVoltageRatingCheck,
  resistorVoltageRatingCheckExample,
  runResistorVoltageRatingCheck,
} from "./tool.js";

describe("resistor voltage rating check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResistorVoltageRatingCheck(resistorVoltageRatingCheckExample.input),
    ).toEqual({ ok: true, output: resistorVoltageRatingCheckExample.output });
  });

  it("passes any applied voltage against the default 250 volt rating", () => {
    expect(calculateResistorVoltageRatingCheck({ appliedVolts: 120 })).toEqual({
      withinRating: true,
    });
    expect(calculateResistorVoltageRatingCheck({ appliedVolts: 250 })).toEqual({
      withinRating: true,
    });
  });

  it("fails once the applied voltage exceeds the rating", () => {
    expect(
      calculateResistorVoltageRatingCheck({
        appliedVolts: 300,
        maxWorkingVolts: 250,
      }),
    ).toEqual({ withinRating: false });
    expect(
      runResistorVoltageRatingCheck({
        appliedVolts: 5,
        maxWorkingVolts: 4.9,
      }),
    ).toEqual({ ok: true, output: { withinRating: false } });
  });

  it("treats equality at the rating as within rating", () => {
    expect(
      calculateResistorVoltageRatingCheck({
        appliedVolts: 100,
        maxWorkingVolts: 100,
      }).withinRating,
    ).toBe(true);
  });

  it("rejects non-positive applied voltages through execution", () => {
    expect(runResistorVoltageRatingCheck({ appliedVolts: -230 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_voltage", field: "appliedVolts" }] },
        ok: false,
      },
    );
    expect(runResistorVoltageRatingCheck({ appliedVolts: 0 }).ok).toBe(false);
  });

  it("applies the default rating when maxWorkingVolts is omitted", () => {
    expect(runResistorVoltageRatingCheck({ appliedVolts: 251 })).toEqual({
      ok: true,
      output: { withinRating: false },
    });
  });
});
