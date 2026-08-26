import { describe, expect, it } from "vitest";
import {
  heterozygosityExpectedExample,
  runHeterozygosityExpected,
} from "./tool.js";

describe("Expected Heterozygosity", () => {
  it("matches the canonical example", () => {
    const result = runHeterozygosityExpected(
      heterozygosityExpectedExample.input,
    );
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.expectedHeterozygosity).toBeCloseTo(0.42, 12);
  });
  it("peaks at p of one half", () =>
    expect(runHeterozygosityExpected({ alleleFrequencyA: 0.5 })).toEqual({
      ok: true,
      output: { expectedHeterozygosity: 0.5 },
    }));
  it("returns zero at p of one", () =>
    expect(runHeterozygosityExpected({ alleleFrequencyA: 1 })).toEqual({
      ok: true,
      output: { expectedHeterozygosity: 0 },
    }));
  it("returns zero at p of zero", () =>
    expect(runHeterozygosityExpected({ alleleFrequencyA: 0 })).toEqual({
      ok: true,
      output: { expectedHeterozygosity: 0 },
    }));
  it("is symmetric around one half", () => {
    const low = runHeterozygosityExpected({ alleleFrequencyA: 0.2 });
    const high = runHeterozygosityExpected({ alleleFrequencyA: 0.8 });
    if (low.ok && high.ok)
      expect(low.output.expectedHeterozygosity).toBeCloseTo(
        Number(high.output.expectedHeterozygosity),
        12,
      );
  });
  it("rejects p above one", () =>
    expect(runHeterozygosityExpected({ alleleFrequencyA: 1.01 }).ok).toBe(
      false,
    ));
  it("rejects negative p", () =>
    expect(runHeterozygosityExpected({ alleleFrequencyA: -0.5 }).ok).toBe(
      false,
    ));
});
