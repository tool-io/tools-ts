import { describe, expect, it } from "vitest";
import { runRunwaySlopeFactor, runwaySlopeFactorExample } from "./tool.js";

describe("runway slope factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRunwaySlopeFactor(runwaySlopeFactorExample.input)).toEqual({
      ok: true,
      output: runwaySlopeFactorExample.output,
    });
  });

  it("multiplies any slope by ten", () => {
    const result = runRunwaySlopeFactor({
      distanceChangePercentPerSlopePercent: 10,
      slopePercent: 1.25,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distanceFactorPercent).toBe(12.5);
  });

  it("negates the factor for downhill slopes", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: -1.5,
      }),
    ).toEqual({
      ok: true,
      output: { distanceFactorPercent: -15 },
    });
  });

  it("multiplies the positive boundary slope by ten", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: 15,
      }),
    ).toEqual({
      ok: true,
      output: { distanceFactorPercent: 150 },
    });
  });

  it("multiplies the negative boundary slope by ten", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: -15,
      }),
    ).toEqual({
      ok: true,
      output: { distanceFactorPercent: -150 },
    });
  });

  it("returns a zero factor for level runways", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { distanceFactorPercent: 0 },
    });
  });

  it("rejects slopes above fifteen percent through validation", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: 15.01,
      }).ok,
    ).toBe(false);
  });

  it("rejects slopes below minus fifteen percent through validation", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: -15.01,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite inputs", () => {
    expect(
      runRunwaySlopeFactor({
        distanceChangePercentPerSlopePercent: 10,
        slopePercent: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
