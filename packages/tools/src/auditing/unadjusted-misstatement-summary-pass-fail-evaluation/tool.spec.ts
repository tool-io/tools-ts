import { describe, expect, it } from "vitest";
import {
  evaluateUnadjustedMisstatements,
  runUnadjustedMisstatement,
  unadjustedMisstatementExample,
} from "./tool.js";

describe("unadjusted misstatement pass-fail evaluation", () => {
  it("reproduces its canonical example", () => {
    expect(
      runUnadjustedMisstatement(unadjustedMisstatementExample.input),
    ).toEqual({
      ok: true,
      output: unadjustedMisstatementExample.output,
    });
  });

  it("nets opposing misstatements", () => {
    expect(
      evaluateUnadjustedMisstatements({
        materiality: 100,
        misstatements: [80, -30],
        safetyMarginPercent: 0,
      }).netMisstatement,
    ).toBe(50);
  });

  it("flags an absolute net amount above effective materiality", () => {
    expect(
      evaluateUnadjustedMisstatements({
        materiality: 100,
        misstatements: [-101],
        safetyMarginPercent: 0,
      }).exceedsMateriality,
    ).toBe(true);
  });

  it("rejects a safety margin of one hundred percent", () => {
    expect(
      runUnadjustedMisstatement({
        materiality: 100,
        misstatements: [],
        safetyMarginPercent: 100,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_safety_margin", field: "safetyMarginPercent" },
        ],
      },
      ok: false,
    });
  });
});
