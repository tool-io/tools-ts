import { describe, expect, it } from "vitest";
import {
  siDiffusionCoefficientPhosphorusExample,
  runSiDiffusionCoefficientPhosphorus,
} from "./tool.js";

const diffusivityOf = (
  result: ReturnType<typeof runSiDiffusionCoefficientPhosphorus>,
): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.diffusivityCm2PerS;
  if (typeof value !== "number")
    throw new Error("Expected numeric diffusivity.");
  return value;
};

describe("Phosphorus Diffusion Coefficient", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus(
        siDiffusionCoefficientPhosphorusExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.2462454170747153e-14 },
    }));

  it("evaluates the lower temperature boundary", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({ temperatureKelvin: 800 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 3.3765682402405414e-23 },
    }));

  it("evaluates the upper temperature boundary", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({ temperatureKelvin: 1600 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.140166116183343e-11 },
    }));

  it("evaluates a typical predeposition temperature", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({ temperatureKelvin: 1200 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.637333938671319e-15 },
    }));

  it("rises Arrhenius-style with temperature", () => {
    const cold = runSiDiffusionCoefficientPhosphorus({
      temperatureKelvin: 900,
    });
    const hot = runSiDiffusionCoefficientPhosphorus({
      temperatureKelvin: 1500,
    });
    expect(cold).toMatchObject({ ok: true });
    expect(hot).toMatchObject({ ok: true });
    expect(diffusivityOf(hot)).toBeGreaterThan(diffusivityOf(cold));
  });

  it("stays positive across the valid range", () => {
    const result = runSiDiffusionCoefficientPhosphorus({
      temperatureKelvin: 1000,
    });
    expect(result).toMatchObject({ ok: true });
    expect(diffusivityOf(result)).toBeGreaterThan(0);
  });

  it("rejects temperatures below the valid range", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({ temperatureKelvin: 799.9 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects temperatures above the valid range", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({ temperatureKelvin: 1600.1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a non-finite temperature", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({
        temperatureKelvin: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a missing temperature", () =>
    expect(runSiDiffusionCoefficientPhosphorus({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runSiDiffusionCoefficientPhosphorus({
        extra: 1,
        temperatureKelvin: 1273,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
