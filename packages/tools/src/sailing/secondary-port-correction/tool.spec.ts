import { describe, expect, it } from "vitest";
import {
  calculateSecondaryPortCorrection,
  runSecondaryPortCorrection,
  secondaryPortCorrectionExample,
} from "./tool.js";

describe("Secondary Port Correction", () => {
  it("publishes an executable example", () =>
    expect(
      runSecondaryPortCorrection(secondaryPortCorrectionExample.input),
    ).toEqual({
      ok: true,
      output: secondaryPortCorrectionExample.output,
    }));

  it.each([
    [-0.4, 0.25, -0.1],
    [0.8, 0.5, 0.4],
    [1.5, 1, 1.5],
    [0.9, 0, 0],
    [-2.2, 0.75, -1.6500000000000001],
  ])(
    "multiplies the range difference by the proportion",
    (rangeDifferenceMeters, interpolationProportion, expected) => {
      expect(
        calculateSecondaryPortCorrection({
          interpolationProportion,
          rangeDifferenceMeters,
        }),
      ).toEqual({ correctionMeters: expected });
    },
  );

  it("returns no correction when the ranges match", () =>
    expect(
      runSecondaryPortCorrection({
        interpolationProportion: 0.4,
        rangeDifferenceMeters: 0,
      }),
    ).toEqual({
      ok: true,
      output: { correctionMeters: 0 },
    }));

  it("keeps signed differences through the multiplication", () => {
    const positive = calculateSecondaryPortCorrection({
      interpolationProportion: 0.5,
      rangeDifferenceMeters: 1.2,
    });
    const negative = calculateSecondaryPortCorrection({
      interpolationProportion: 0.5,
      rangeDifferenceMeters: -1.2,
    });
    expect(negative.correctionMeters).toBe(-positive.correctionMeters);
  });

  it("accepts proportions at the zero and one bounds", () => {
    expect(
      runSecondaryPortCorrection({
        interpolationProportion: 0,
        rangeDifferenceMeters: 1,
      }).ok,
    ).toBe(true);
    expect(
      runSecondaryPortCorrection({
        interpolationProportion: 1,
        rangeDifferenceMeters: 1,
      }).ok,
    ).toBe(true);
  });

  it("rejects proportions outside zero to one", () => {
    for (const interpolationProportion of [-0.01, 1.01])
      expect(
        runSecondaryPortCorrection({
          interpolationProportion,
          rangeDifferenceMeters: 1,
        }).ok,
      ).toBe(false);
  });

  it("rejects non-finite and malformed input", () => {
    expect(
      runSecondaryPortCorrection({
        interpolationProportion: Number.NaN,
        rangeDifferenceMeters: 1,
      }).ok,
    ).toBe(false);
    expect(
      runSecondaryPortCorrection({
        interpolationProportion: 0.5,
        rangeDifferenceMeters: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing and unknown fields", () => {
    expect(runSecondaryPortCorrection({ rangeDifferenceMeters: 1 }).ok).toBe(
      false,
    );
    expect(
      runSecondaryPortCorrection({
        extra: 1,
        interpolationProportion: 0.5,
        rangeDifferenceMeters: 1,
      }).ok,
    ).toBe(false);
  });
});
