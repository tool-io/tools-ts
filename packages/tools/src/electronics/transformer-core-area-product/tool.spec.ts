import { describe, expect, it } from "vitest";
import {
  calculateTransformerCoreAreaProduct,
  runTransformerCoreAreaProduct,
  transformerCoreAreaProductExample,
} from "./tool.js";

describe("Core Area Product", () => {
  it("reproduces its canonical example with all defaults", () => {
    expect(
      runTransformerCoreAreaProduct(transformerCoreAreaProductExample.input),
    ).toEqual({ ok: true, output: transformerCoreAreaProductExample.output });
  });

  it("matches the area-product formula with explicit constants", () => {
    expect(
      calculateTransformerCoreAreaProduct({
        currentDensityACm2: 200,
        fluxSwingT: 0.25,
        khFactor: 0.02,
        powerVa: 24,
        switchingFreqKhz: 100,
        windowFillFactor: 0.5,
      }).areaProductCm4,
    ).toBe((24 * 1e4) / (0.02 * 100 * 200 * 0.5 * 0.25));
  });

  it("halves the area product when the switching frequency doubles", () => {
    expect(
      calculateTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        switchingFreqKhz: 100,
      }).areaProductCm4,
    ).toBe(2232.142857142857);
  });

  it("scales linearly with the power rating", () => {
    expect(
      calculateTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        powerVa: 40,
      }).areaProductCm4,
    ).toBeCloseTo(4 * 4464.285714285714, 9);
  });

  it("shrinks for a larger allowed flux swing", () => {
    expect(
      calculateTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        fluxSwingT: 0.4,
      }).areaProductCm4,
    ).toBe(2232.142857142857);
  });

  it("rejects non-positive power or frequency", () => {
    expect(
      runTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        powerVa: 0,
      }).ok,
    ).toBe(false);
    expect(
      runTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        switchingFreqKhz: -50,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive optional factors", () => {
    expect(
      runTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        khFactor: 0,
      }).ok,
    ).toBe(false);
    expect(
      runTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        currentDensityACm2: 0,
      }).ok,
    ).toBe(false);
    expect(
      runTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        windowFillFactor: -0.4,
      }).ok,
    ).toBe(false);
    expect(
      runTransformerCoreAreaProduct({
        ...transformerCoreAreaProductExample.input,
        fluxSwingT: 0,
      }).ok,
    ).toBe(false);
  });
});
