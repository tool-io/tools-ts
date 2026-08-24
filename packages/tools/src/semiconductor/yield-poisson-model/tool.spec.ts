import { describe, expect, it } from "vitest";
import { runYieldPoissonModel, yieldPoissonModelExample } from "./tool.js";

describe("Poisson Yield Model", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runYieldPoissonModel(yieldPoissonModelExample.input)).toEqual({
      ok: true,
      output: { yieldPercent: 90.48374180359595 },
    }));

  it("predicts perfect yield at zero defect density", () =>
    expect(
      runYieldPoissonModel({ defectDensityPerCm2: 0, dieAreaCm2: 1 }),
    ).toEqual({
      ok: true,
      output: { yieldPercent: 100 },
    }));

  it("decays exponentially with die area", () =>
    expect(
      runYieldPoissonModel({ defectDensityPerCm2: 0.1, dieAreaCm2: 2 }),
    ).toEqual({
      ok: true,
      output: { yieldPercent: 81.87307530779819 },
    }));

  it("approaches zero yield for huge defect exposure", () => {
    const result = runYieldPoissonModel({
      defectDensityPerCm2: 1000,
      dieAreaCm2: 10,
    });
    expect(result.ok && result.output.yieldPercent).toBeLessThan(1e-40);
  });

  it("rejects negative defect density below the schema minimum", () =>
    expect(
      runYieldPoissonModel({ defectDensityPerCm2: -0.1, dieAreaCm2: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "defectDensityPerCm2" }],
      },
      ok: false,
    }));

  it("rejects zero die area", () =>
    expect(
      runYieldPoissonModel({ defectDensityPerCm2: 0.1, dieAreaCm2: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "dieAreaCm2" }] },
      ok: false,
    }));

  it("rejects negative die area", () =>
    expect(
      runYieldPoissonModel({ defectDensityPerCm2: 0.1, dieAreaCm2: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "degenerate_input", field: "dieAreaCm2" }] },
      ok: false,
    }));

  it("rejects non-finite inputs", () =>
    expect(
      runYieldPoissonModel({ defectDensityPerCm2: Number.NaN, dieAreaCm2: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "defectDensityPerCm2" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runYieldPoissonModel({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "defectDensityPerCm2" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runYieldPoissonModel({
        defectDensityPerCm2: 0.1,
        dieAreaCm2: 1,
        extra: 5,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
