import { describe, expect, it } from "vitest";
import {
  calculateElectromigrationMedianTimeToFailureBlack,
  electromigrationMedianTimeToFailureBlackExample,
  runElectromigrationMedianTimeToFailureBlack,
} from "./tool.js";

describe("Black Exponent Extraction Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runElectromigrationMedianTimeToFailureBlack(
        electromigrationMedianTimeToFailureBlackExample.input,
      ),
    ).toEqual({
      ok: true,
      output: electromigrationMedianTimeToFailureBlackExample.output,
    });
  });

  it("extracts cubic, zero, and negative exponents", () => {
    expect(
      calculateElectromigrationMedianTimeToFailureBlack({
        currentDensityOne: 1,
        currentDensityTwo: 2,
        mttfOneHours: 8000,
        mttfTwoHours: 1000,
      }).currentDensityExponent,
    ).toBe(3);
    expect(
      calculateElectromigrationMedianTimeToFailureBlack({
        currentDensityOne: 1,
        currentDensityTwo: 2,
        mttfOneHours: 500,
        mttfTwoHours: 500,
      }).currentDensityExponent,
    ).toBe(0);
    expect(
      calculateElectromigrationMedianTimeToFailureBlack({
        currentDensityOne: 2,
        currentDensityTwo: 1,
        mttfOneHours: 1000,
        mttfTwoHours: 250,
      }).currentDensityExponent,
    ).toBe(-2);
  });

  it("handles finite values whose direct ratio overflows", () => {
    expect(
      calculateElectromigrationMedianTimeToFailureBlack({
        currentDensityOne: 1e-200,
        currentDensityTwo: 1e200,
        mttfOneHours: 1e200,
        mttfTwoHours: 1e-200,
      }).currentDensityExponent,
    ).toBe(1);
  });

  it("rejects identical current densities", () => {
    expect(
      runElectromigrationMedianTimeToFailureBlack({
        currentDensityOne: 5,
        currentDensityTwo: 5,
        mttfOneHours: 100,
        mttfTwoHours: 200,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "currentDensityTwo" }],
      },
      ok: false,
    });
  });

  it.each([
    [
      "currentDensityOne",
      {
        currentDensityOne: 0,
        currentDensityTwo: 2,
        mttfOneHours: 100,
        mttfTwoHours: 50,
      },
    ],
    [
      "currentDensityTwo",
      {
        currentDensityOne: 1,
        currentDensityTwo: Number.NaN,
        mttfOneHours: 100,
        mttfTwoHours: 50,
      },
    ],
    [
      "mttfOneHours",
      {
        currentDensityOne: 1,
        currentDensityTwo: 2,
        mttfOneHours: 0,
        mttfTwoHours: 50,
      },
    ],
    [
      "mttfTwoHours",
      {
        currentDensityOne: 1,
        currentDensityTwo: 2,
        mttfOneHours: 100,
        mttfTwoHours: Number.POSITIVE_INFINITY,
      },
    ],
  ] as const)("rejects an invalid %s", (field, input) => {
    expect(() =>
      calculateElectromigrationMedianTimeToFailureBlack(input),
    ).toThrow();
    expect(runElectromigrationMedianTimeToFailureBlack(input)).toMatchObject({
      error: { issues: [{ field }] },
      ok: false,
    });
  });

  it("rejects missing required input", () => {
    expect(
      runElectromigrationMedianTimeToFailureBlack({
        currentDensityOne: 1,
        currentDensityTwo: 2,
        mttfOneHours: 100,
      } as never).ok,
    ).toBe(false);
  });
});
