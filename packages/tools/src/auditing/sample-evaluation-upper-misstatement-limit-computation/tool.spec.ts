import { describe, expect, it } from "vitest";
import {
  computeUpperMisstatementLimit,
  runUpperMisstatement,
  upperMisstatementExample,
} from "./tool.js";

describe("sample evaluation upper misstatement limit", () => {
  it("reproduces its canonical example", () => {
    expect(runUpperMisstatement(upperMisstatementExample.input)).toEqual({
      ok: true,
      output: upperMisstatementExample.output,
    });
  });

  it("accepts an upper limit exactly at tolerance", () => {
    expect(
      computeUpperMisstatementLimit({
        otherKnownMisstatements: 0,
        projectedMisstatement: 40,
        samplingRiskAllowance: 5,
        tolerableMisstatement: 45,
      }),
    ).toMatchObject({ upperLimit: 45, exceedsTolerable: false });
  });

  it("reports zero remaining tolerance at the limit", () => {
    expect(
      computeUpperMisstatementLimit({
        otherKnownMisstatements: 0,
        projectedMisstatement: 10,
        samplingRiskAllowance: 0,
        tolerableMisstatement: 10,
      }).remainingAgainstTolerance,
    ).toBe(0);
  });

  it("rejects a negative misstatement component", () => {
    expect(
      runUpperMisstatement({
        otherKnownMisstatements: 0,
        projectedMisstatement: -1,
        samplingRiskAllowance: 0,
        tolerableMisstatement: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "projectedMisstatement" }],
      },
      ok: false,
    });
  });
});
