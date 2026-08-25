import { describe, expect, it } from "vitest";
import { helmBalanceRatioExample, runHelmBalanceRatio } from "./tool.js";

describe("Helm Balance Ratio", () => {
  it("calculates the canonical weather helm example", () =>
    expect(runHelmBalanceRatio(helmBalanceRatioExample.input)).toEqual({
      ok: true,
      output: helmBalanceRatioExample.output,
    }));
  it("returns negative percentages for lee helm", () =>
    expect(
      runHelmBalanceRatio({ ceForwardOfClDistanceMeters: -0.6, loaMeters: 12 }),
    ).toEqual({ ok: true, output: { balancePercent: -5 } }));
  it("returns zero for a balanced rig", () =>
    expect(
      runHelmBalanceRatio({ ceForwardOfClDistanceMeters: 0, loaMeters: 12 }),
    ).toEqual({ ok: true, output: { balancePercent: 0 } }));
  it("dilutes with longer overall length", () =>
    expect(
      runHelmBalanceRatio({ ceForwardOfClDistanceMeters: 0.6, loaMeters: 24 }),
    ).toEqual({ ok: true, output: { balancePercent: 2.5 } }));
  it("accepts any signed finite distance", () =>
    expect(
      runHelmBalanceRatio({ ceForwardOfClDistanceMeters: -6, loaMeters: 12 }),
    ).toEqual({ ok: true, output: { balancePercent: -50 } }));
  it("rejects zero LOA", () => {
    const result = runHelmBalanceRatio({
      ceForwardOfClDistanceMeters: 0.6,
      loaMeters: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_loa");
  });
  it("rejects negative LOA", () =>
    expect(
      runHelmBalanceRatio({ ceForwardOfClDistanceMeters: 0.6, loaMeters: -12 })
        .ok,
    ).toBe(false));
  it("rejects missing and malformed input", () => {
    expect(runHelmBalanceRatio({}).ok).toBe(false);
    expect(runHelmBalanceRatio({ ceForwardOfClDistanceMeters: "0.6" }).ok).toBe(
      false,
    );
    expect(
      runHelmBalanceRatio({
        ceForwardOfClDistanceMeters: Number.POSITIVE_INFINITY,
        loaMeters: 12,
      }).ok,
    ).toBe(false);
  });
  it("rejects unknown fields", () =>
    expect(
      runHelmBalanceRatio({
        ceForwardOfClDistanceMeters: 0.6,
        loaMeters: 12,
        leadPercent: 5,
      }).ok,
    ).toBe(false));
});
