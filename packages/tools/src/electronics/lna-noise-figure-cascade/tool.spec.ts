import { describe, expect, it } from "vitest";
import {
  lnaNoiseFigureCascadeExample,
  runLnaNoiseFigureCascade,
} from "./tool.js";

const outputOf = (input: {
  f1Linear: number;
  f2Linear: number;
  g1Linear: number;
}) => {
  const result = runLnaNoiseFigureCascade(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { totalNoiseFactor: number };
};

describe("Friis Two-Stage NF", () => {
  it("reproduces the canonical example", () =>
    expect(
      runLnaNoiseFigureCascade(lnaNoiseFigureCascadeExample.input),
    ).toEqual({
      ok: true,
      output: { totalNoiseFactor: 1.7 },
    }));

  it("evaluates the Friis formula directly", () => {
    const { totalNoiseFactor } = outputOf({
      f1Linear: 1.2,
      f2Linear: 4,
      g1Linear: 20,
    });
    expect(totalNoiseFactor).toBeCloseTo(1.2 + (4 - 1) / 20, 12);
  });

  it("reduces to the first stage when its gain is infinite", () => {
    const { totalNoiseFactor } = outputOf({
      f1Linear: 1.5,
      f2Linear: 6,
      g1Linear: 1e12,
    });
    expect(totalNoiseFactor).toBeCloseTo(1.5, 6);
  });

  it("approaches f1 + f2 - 1 as first-stage gain approaches one", () => {
    const { totalNoiseFactor } = outputOf({
      f1Linear: 1.1,
      f2Linear: 3,
      g1Linear: 1.0000000001,
    });
    expect(totalNoiseFactor).toBeCloseTo(1.1 + 2, 6);
  });

  it("always exceeds the first-stage noise factor", () => {
    const { totalNoiseFactor } = outputOf({
      f1Linear: 1.01,
      f2Linear: 1.02,
      g1Linear: 50,
    });
    expect(totalNoiseFactor).toBeGreaterThan(1.01);
  });

  it("rejects sub-unity noise factors with below_unity", () => {
    const lowF1 = runLnaNoiseFigureCascade({
      f1Linear: 0.9,
      f2Linear: 2,
      g1Linear: 10,
    });
    const lowF2 = runLnaNoiseFigureCascade({
      f1Linear: 2,
      f2Linear: 0.5,
      g1Linear: 10,
    });
    expect(lowF1.ok).toBe(false);
    expect(lowF2.ok).toBe(false);
    if (!lowF1.ok) expect(lowF1.error.issues[0]?.code).toBe("below_unity");
  });

  it("accepts unity noise factors", () =>
    expect(
      outputOf({ f1Linear: 1, f2Linear: 1, g1Linear: 10 }).totalNoiseFactor,
    ).toBeCloseTo(1, 12));

  it("rejects non-positive first-stage gain", () => {
    expect(
      runLnaNoiseFigureCascade({ f1Linear: 1.5, f2Linear: 3, g1Linear: 0 }).ok,
    ).toBe(false);
    expect(
      runLnaNoiseFigureCascade({ f1Linear: 1.5, f2Linear: 3, g1Linear: -4 }).ok,
    ).toBe(false);
  });
});
