import { describe, expect, it } from "vitest";
import {
  runSporulationDensityMm2Converter,
  sporulationDensityMm2ConverterExample,
} from "./tool.js";

describe("Sporulation Density", () => {
  it("matches the canonical example", () => {
    expect(
      runSporulationDensityMm2Converter(
        sporulationDensityMm2ConverterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: sporulationDensityMm2ConverterExample.output,
    });
  });
  it("handles fractional areas", () =>
    expect(
      runSporulationDensityMm2Converter({
        countedSpores: 100,
        fieldAreaMm2: 0.5,
      }),
    ).toEqual({ ok: true, output: { sporesPerMm2: 200 } }));
  it("allows zero spores", () =>
    expect(
      runSporulationDensityMm2Converter({
        countedSpores: 0,
        fieldAreaMm2: 4,
      }),
    ).toEqual({ ok: true, output: { sporesPerMm2: 0 } }));
  it("rejects zero area", () =>
    expect(
      runSporulationDensityMm2Converter({
        countedSpores: 50,
        fieldAreaMm2: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative area", () =>
    expect(
      runSporulationDensityMm2Converter({
        countedSpores: 50,
        fieldAreaMm2: -2,
      }).ok,
    ).toBe(false));
  it("rejects negative spore counts", () =>
    expect(
      runSporulationDensityMm2Converter({
        countedSpores: -5,
        fieldAreaMm2: 4,
      }).ok,
    ).toBe(false));
  it("rejects fractional spore counts", () =>
    expect(
      runSporulationDensityMm2Converter({
        countedSpores: 10.5,
        fieldAreaMm2: 2,
      }).ok,
    ).toBe(false));
});
