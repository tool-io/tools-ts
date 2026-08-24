import { describe, expect, it } from "vitest";
import {
  runSingleEventLatchupCrossSection,
  singleEventLatchupCrossSectionExample,
} from "./tool.js";

describe("SEL Cross Section Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSingleEventLatchupCrossSection(
        singleEventLatchupCrossSectionExample.input,
      ),
    ).toEqual({
      ok: true,
      output: singleEventLatchupCrossSectionExample.output,
    });
  });

  it("returns zero below the threshold LET", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 9.9,
        saturationCrossSectionUm2: 1,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }),
    ).toEqual({ ok: true, output: { crossSectionUm2: 0 } });
  });

  it("returns zero exactly at the threshold LET", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 10,
        saturationCrossSectionUm2: 1,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }),
    ).toEqual({ ok: true, output: { crossSectionUm2: 0 } });
  });

  it("matches one minus the exponential above threshold", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 15,
        saturationCrossSectionUm2: 2,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }),
    ).toEqual({ ok: true, output: { crossSectionUm2: 1.2642411176571153 } });
  });

  it("applies a non-unit Weibull shape exponent", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 20,
        saturationCrossSectionUm2: 2,
        shapeExponent: 2,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }),
    ).toEqual({ ok: true, output: { crossSectionUm2: 1.9633687222225316 } });
  });

  it("rises monotonically with LET above the threshold", () => {
    const low = runSingleEventLatchupCrossSection({
      letPerCm2Mg: 15,
      saturationCrossSectionUm2: 1,
      thresholdLETPerCm2Mg: 10,
      widthParameterPerCm2Mg: 5,
    });
    const high = runSingleEventLatchupCrossSection({
      letPerCm2Mg: 25,
      saturationCrossSectionUm2: 1,
      thresholdLETPerCm2Mg: 10,
      widthParameterPerCm2Mg: 5,
    });
    expect(low.ok).toBe(true);
    expect(high.ok).toBe(true);
    if (!low.ok || !high.ok) return;
    const lowValue = low.output.crossSectionUm2 as number;
    const highValue = high.output.crossSectionUm2 as number;
    expect(highValue).toBeGreaterThan(lowValue);
  });

  it("approaches but never exceeds the saturation cross section", () => {
    const result = runSingleEventLatchupCrossSection({
      letPerCm2Mg: 60,
      saturationCrossSectionUm2: 1,
      thresholdLETPerCm2Mg: 10,
      widthParameterPerCm2Mg: 5,
    });
    expect(result).toEqual({
      ok: true,
      output: { crossSectionUm2: 0.9999546000702375 },
    });
    if (!result.ok) return;
    expect(result.output.crossSectionUm2).toBeLessThan(1);
  });

  it("scales linearly with the saturation cross section", () => {
    const small = runSingleEventLatchupCrossSection({
      letPerCm2Mg: 20,
      saturationCrossSectionUm2: 0.5,
      thresholdLETPerCm2Mg: 10,
      widthParameterPerCm2Mg: 5,
    });
    expect(small).toEqual({
      ok: true,
      output: { crossSectionUm2: 0.43233235838169365 },
    });
  });

  it("rejects a negative threshold LET through validation", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 20,
        saturationCrossSectionUm2: 1,
        thresholdLETPerCm2Mg: -1,
        widthParameterPerCm2Mg: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects a non-positive saturation cross section", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 20,
        saturationCrossSectionUm2: 0,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects a zero width parameter", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: 20,
        saturationCrossSectionUm2: 1,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
  });

  it("rejects a non-finite LET", () => {
    expect(
      runSingleEventLatchupCrossSection({
        letPerCm2Mg: Number.NaN,
        saturationCrossSectionUm2: 1,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(
      runSingleEventLatchupCrossSection({
        saturationCrossSectionUm2: 1,
        thresholdLETPerCm2Mg: 10,
        widthParameterPerCm2Mg: 5,
      }).ok,
    ).toBe(false);
  });
});
