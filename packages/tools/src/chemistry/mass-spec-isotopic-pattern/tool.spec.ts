import { describe, expect, it } from "vitest";
import {
  massSpecIsotopicPatternExample,
  runMassSpecIsotopicPattern,
} from "./tool.js";
describe("Isotope Pattern Ratio", () => {
  it("publishes an executable example", () =>
    expect(
      runMassSpecIsotopicPattern(massSpecIsotopicPatternExample.input),
    ).toEqual({
      ok: true,
      output: massSpecIsotopicPatternExample.output,
    }));
  it("returns zero for carbon-free compounds", () =>
    expect(runMassSpecIsotopicPattern({ carbonCount: 0 })).toEqual({
      ok: true,
      output: { isotopeRatioM1M: 0 },
    }));
  it("returns about 1.1 percent per carbon", () =>
    expect(runMassSpecIsotopicPattern({ carbonCount: 1 })).toEqual({
      ok: true,
      output: { isotopeRatioM1M: 0.011 },
    }));
  it("scales linearly toward large molecules", () => {
    const result = runMassSpecIsotopicPattern({ carbonCount: 100 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.isotopeRatioM1M).toBeCloseTo(1.1, 12);
  });
  it("matches a fatty acid count closely", () => {
    const result = runMassSpecIsotopicPattern({ carbonCount: 18 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.isotopeRatioM1M).toBeCloseTo(0.198, 12);
  });
  it("rejects counts above two hundred", () =>
    expect(runMassSpecIsotopicPattern({ carbonCount: 201 }).ok).toBe(false));
  it("rejects negative counts", () =>
    expect(runMassSpecIsotopicPattern({ carbonCount: -1 }).ok).toBe(false));
  it("rejects fractional carbon counts", () =>
    expect(runMassSpecIsotopicPattern({ carbonCount: 6.5 }).ok).toBe(false));
});
