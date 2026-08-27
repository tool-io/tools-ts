import { describe, expect, it } from "vitest";
import { harkerDiagramSilicaExample, runHarkerDiagramSilica } from "./tool.js";

describe("harker-diagram-silica", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHarkerDiagramSilica(harkerDiagramSilicaExample.input)).toEqual({
      ok: true,
      output: harkerDiagramSilicaExample.output,
    });
  });

  it("rejects invalid coordinates and names", () => {
    expect(
      runHarkerDiagramSilica({
        ...harkerDiagramSilicaExample.input,
        siO2WtPercent: 0,
      }).ok,
    ).toBe(false);
    expect(
      runHarkerDiagramSilica({
        ...harkerDiagramSilicaExample.input,
        oxideName: "bad name!",
      }).ok,
    ).toBe(false);
    expect(
      runHarkerDiagramSilica({
        ...harkerDiagramSilicaExample.input,
        oxideWtPercent: -2,
      }).ok,
    ).toBe(false);
    expect(
      runHarkerDiagramSilica({
        ...harkerDiagramSilicaExample.input,
        oxideWtPercent: 101,
      }).ok,
    ).toBe(false);
  });

  it("trims a valid oxide label", () => {
    expect(
      runHarkerDiagramSilica({
        oxideName: "  Fe2O3  ",
        oxideWtPercent: 8.5,
        siO2WtPercent: 52,
      }),
    ).toEqual({
      ok: true,
      output: {
        oxideName: "Fe2O3",
        xSiO2WtPercent: 52,
        yOxideWtPercent: 8.5,
      },
    });
  });
});
