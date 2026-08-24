import { describe, expect, it } from "vitest";
import {
  siDiffusionCoefficientAntimonyExample,
  runSiDiffusionCoefficientAntimony,
} from "./tool.js";

const diffusivityOf = (
  result: ReturnType<typeof runSiDiffusionCoefficientAntimony>,
): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.diffusivityCm2PerS;
  if (typeof value !== "number")
    throw new Error("Expected numeric diffusivity.");
  return value;
};

describe("Antimony Diffusion Coefficient", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runSiDiffusionCoefficientAntimony(
        siDiffusionCoefficientAntimonyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 7.588333190382194e-16 },
    }));

  it("evaluates the lower temperature boundary", () =>
    expect(
      runSiDiffusionCoefficientAntimony({ temperatureKelvin: 800 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 2.169830464263064e-24 },
    }));

  it("evaluates the upper temperature boundary", () =>
    expect(
      runSiDiffusionCoefficientAntimony({ temperatureKelvin: 1600 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 6.814277066221299e-13 },
    }));

  it("evaluates a typical buried-layer step temperature", () =>
    expect(
      runSiDiffusionCoefficientAntimony({ temperatureKelvin: 1200 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.0025094136224955e-16 },
    }));

  it("rises Arrhenius-style with temperature", () => {
    const cold = runSiDiffusionCoefficientAntimony({ temperatureKelvin: 900 });
    const hot = runSiDiffusionCoefficientAntimony({ temperatureKelvin: 1500 });
    expect(cold).toMatchObject({ ok: true });
    expect(hot).toMatchObject({ ok: true });
    expect(diffusivityOf(hot)).toBeGreaterThan(diffusivityOf(cold));
  });

  it("stays positive across the valid range", () => {
    const result = runSiDiffusionCoefficientAntimony({
      temperatureKelvin: 1000,
    });
    expect(result).toMatchObject({ ok: true });
    expect(diffusivityOf(result)).toBeGreaterThan(0);
  });

  it("rejects temperatures below the valid range", () =>
    expect(
      runSiDiffusionCoefficientAntimony({ temperatureKelvin: 799.9 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects temperatures above the valid range", () =>
    expect(
      runSiDiffusionCoefficientAntimony({ temperatureKelvin: 1600.1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a non-finite temperature", () =>
    expect(
      runSiDiffusionCoefficientAntimony({
        temperatureKelvin: Number.NEGATIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a missing temperature", () =>
    expect(runSiDiffusionCoefficientAntimony({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runSiDiffusionCoefficientAntimony({
        extra: 1,
        temperatureKelvin: 1273,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
