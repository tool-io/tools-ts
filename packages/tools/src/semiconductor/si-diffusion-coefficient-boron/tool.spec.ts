import { describe, expect, it } from "vitest";
import {
  siDiffusionCoefficientBoronExample,
  runSiDiffusionCoefficientBoron,
} from "./tool.js";

const diffusivityOf = (
  result: ReturnType<typeof runSiDiffusionCoefficientBoron>,
): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.diffusivityCm2PerS;
  if (typeof value !== "number")
    throw new Error("Expected numeric diffusivity.");
  return value;
};

describe("Boron Diffusion Coefficient", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runSiDiffusionCoefficientBoron(siDiffusionCoefficientBoronExample.input),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.5150457229801047e-13 },
    }));

  it("evaluates the lower temperature boundary", () =>
    expect(runSiDiffusionCoefficientBoron({ temperatureKelvin: 800 })).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.2127546272253963e-22 },
    }));

  it("evaluates the upper temperature boundary", () =>
    expect(runSiDiffusionCoefficientBoron({ temperatureKelvin: 1600 })).toEqual(
      {
        ok: true,
        output: { diffusivityCm2PerS: 9.600487053745249e-12 },
      },
    ));

  it("evaluates a typical drive-in temperature", () =>
    expect(runSiDiffusionCoefficientBoron({ temperatureKelvin: 1200 })).toEqual(
      {
        ok: true,
        output: { diffusivityCm2PerS: 2.2359040244794906e-15 },
      },
    ));

  it("rises Arrhenius-style with temperature", () => {
    const cold = runSiDiffusionCoefficientBoron({ temperatureKelvin: 900 });
    const hot = runSiDiffusionCoefficientBoron({ temperatureKelvin: 1500 });
    expect(cold).toMatchObject({ ok: true });
    expect(hot).toMatchObject({ ok: true });
    expect(diffusivityOf(hot)).toBeGreaterThan(diffusivityOf(cold));
  });

  it("stays positive across the valid range", () => {
    const result = runSiDiffusionCoefficientBoron({ temperatureKelvin: 1000 });
    expect(result).toMatchObject({ ok: true });
    expect(diffusivityOf(result)).toBeGreaterThan(0);
  });

  it("rejects temperatures below the valid range", () =>
    expect(
      runSiDiffusionCoefficientBoron({ temperatureKelvin: 799.9 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects temperatures above the valid range", () =>
    expect(
      runSiDiffusionCoefficientBoron({ temperatureKelvin: 1600.1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a non-finite temperature", () =>
    expect(
      runSiDiffusionCoefficientBoron({ temperatureKelvin: Number.NaN }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a missing temperature", () =>
    expect(runSiDiffusionCoefficientBoron({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runSiDiffusionCoefficientBoron({
        extra: 1,
        temperatureKelvin: 1373,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
