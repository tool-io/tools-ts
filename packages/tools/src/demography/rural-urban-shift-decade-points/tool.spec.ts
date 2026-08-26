import { describe, expect, it } from "vitest";
import {
  calculateRuralUrbanShiftDecadePoints,
  runRuralUrbanShiftDecadePoints,
  ruralUrbanShiftDecadePointsExample,
} from "./tool.js";

describe("demography/rural-urban-shift-decade-points", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRuralUrbanShiftDecadePoints(ruralUrbanShiftDecadePointsExample.input),
    ).toEqual({
      ok: true,
      output: ruralUrbanShiftDecadePointsExample.output,
    });
  });

  it("labels counter-urbanization and flat shares", () => {
    expect(
      calculateRuralUrbanShiftDecadePoints({
        urbanShareFirstDecadePercent: 60,
        urbanShareLaterDecadePercent: 55,
      }).direction,
    ).toBe("deurbanizing");
    expect(
      calculateRuralUrbanShiftDecadePoints({
        urbanShareFirstDecadePercent: 50,
        urbanShareLaterDecadePercent: 50.3,
      }).direction,
    ).toBe("stable");
  });

  it("rejects shares outside zero to one hundred percent", () => {
    expect(
      runRuralUrbanShiftDecadePoints({
        urbanShareFirstDecadePercent: -1,
        urbanShareLaterDecadePercent: 10,
      }).ok,
    ).toBe(false);
    expect(
      runRuralUrbanShiftDecadePoints({
        urbanShareFirstDecadePercent: 10,
        urbanShareLaterDecadePercent: 101,
      }).ok,
    ).toBe(false);
  });
});
