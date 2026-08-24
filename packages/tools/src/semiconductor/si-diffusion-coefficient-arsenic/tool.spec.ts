import { describe, expect, it } from "vitest";
import {
  siDiffusionCoefficientArsenicExample,
  runSiDiffusionCoefficientArsenic,
} from "./tool.js";

const diffusivityOf = (
  result: ReturnType<typeof runSiDiffusionCoefficientArsenic>,
): number => {
  if (!result.ok) throw new Error("Expected success result.");
  const value = result.output.diffusivityCm2PerS;
  if (typeof value !== "number")
    throw new Error("Expected numeric diffusivity.");
  return value;
};

describe("Arsenic Diffusion Coefficient", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runSiDiffusionCoefficientArsenic(
        siDiffusionCoefficientArsenicExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.3487164056197636e-15 },
    }));

  it("evaluates the lower temperature boundary", () =>
    expect(
      runSiDiffusionCoefficientArsenic({ temperatureKelvin: 800 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 3.4108658254884047e-25 },
    }));

  it("evaluates the upper temperature boundary", () =>
    expect(
      runSiDiffusionCoefficientArsenic({ temperatureKelvin: 1600 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 2.8008911793611927e-12 },
    }));

  it("evaluates a typical anneal temperature", () =>
    expect(
      runSiDiffusionCoefficientArsenic({ temperatureKelvin: 1200 }),
    ).toEqual({
      ok: true,
      output: { diffusivityCm2PerS: 1.388307604403322e-16 },
    }));

  it("rises Arrhenius-style with temperature", () => {
    const cold = runSiDiffusionCoefficientArsenic({ temperatureKelvin: 900 });
    const hot = runSiDiffusionCoefficientArsenic({ temperatureKelvin: 1500 });
    expect(cold).toMatchObject({ ok: true });
    expect(hot).toMatchObject({ ok: true });
    expect(diffusivityOf(hot)).toBeGreaterThan(diffusivityOf(cold));
  });

  it("stays positive across the valid range", () => {
    const result = runSiDiffusionCoefficientArsenic({
      temperatureKelvin: 1000,
    });
    expect(result).toMatchObject({ ok: true });
    expect(diffusivityOf(result)).toBeGreaterThan(0);
  });

  it("rejects temperatures below the valid range", () =>
    expect(
      runSiDiffusionCoefficientArsenic({ temperatureKelvin: 799.9 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects temperatures above the valid range", () =>
    expect(
      runSiDiffusionCoefficientArsenic({ temperatureKelvin: 1600.1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a non-finite temperature", () =>
    expect(
      runSiDiffusionCoefficientArsenic({ temperatureKelvin: Number.NaN }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects a missing temperature", () =>
    expect(runSiDiffusionCoefficientArsenic({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureKelvin" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runSiDiffusionCoefficientArsenic({
        extra: 1,
        temperatureKelvin: 1273,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
