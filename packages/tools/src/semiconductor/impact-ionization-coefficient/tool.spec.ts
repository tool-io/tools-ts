import { describe, expect, it } from "vitest";
import {
  impactIonizationCoefficientExample,
  runImpactIonizationCoefficient,
} from "./tool.js";

describe("Impact Ionization Coefficient Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runImpactIonizationCoefficient(impactIonizationCoefficientExample.input),
    ).toEqual({
      ok: true,
      output: impactIonizationCoefficientExample.output,
    }));

  it("matches the Chynoweth identity at one megavolt per centimeter", () => {
    const result = runImpactIonizationCoefficient({
      electricFieldMVPerCm: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.ionizationCoefficientPerCm).toBeCloseTo(
      7.03e5 * Math.exp(-1.231),
      15,
    );
  });

  it("rises monotonically with the electric field", () => {
    const low = runImpactIonizationCoefficient({ electricFieldMVPerCm: 0.5 });
    const high = runImpactIonizationCoefficient({ electricFieldMVPerCm: 1 });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    const lowValue = low.output.ionizationCoefficientPerCm as number;
    const highValue = high.output.ionizationCoefficientPerCm as number;
    expect(highValue).toBeGreaterThan(lowValue);
  });

  it("approaches the 7.03e5 prefactor at very high fields", () => {
    const result = runImpactIonizationCoefficient({
      electricFieldMVPerCm: 1000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.ionizationCoefficientPerCm).toBeGreaterThan(7e5);
    expect(result.output.ionizationCoefficientPerCm).toBeLessThan(7.03e5);
  });

  it("reports numerical underflow for vanishing fields", () =>
    expect(
      runImpactIonizationCoefficient({ electricFieldMVPerCm: 1e-6 }),
    ).toMatchObject({
      error: { issues: [{ code: "numeric_underflow" }] },
      ok: false,
    }));

  it("rejects zero electric field", () =>
    expect(
      runImpactIonizationCoefficient({ electricFieldMVPerCm: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a negative electric field", () =>
    expect(
      runImpactIonizationCoefficient({ electricFieldMVPerCm: -2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects a non-finite electric field", () =>
    expect(
      runImpactIonizationCoefficient({
        electricFieldMVPerCm: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "electricFieldMVPerCm" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runImpactIonizationCoefficient({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "electricFieldMVPerCm" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runImpactIonizationCoefficient({
        electricFieldMVPerCm: 1,
        extra: "x",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
