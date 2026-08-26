import { describe, expect, it } from "vitest";
import { haplotypeFrequencyExample, runHaplotypeFrequency } from "./tool.js";

describe("Haplotype Frequency", () => {
  it("publishes an executable example", () =>
    expect(runHaplotypeFrequency(haplotypeFrequencyExample.input)).toEqual({
      ok: true,
      output: haplotypeFrequencyExample.output,
    }));
  it("divides the count by two diploid copies per individual", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: 7, individualsTotal: 80 }),
    ).toEqual({ ok: true, output: { haplotypeFrequency: 0.04375 } }));
  it("yields zero for an absent haplotype", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: 0, individualsTotal: 40 }),
    ).toEqual({ ok: true, output: { haplotypeFrequency: 0 } }));
  it("yields one when every copy carries the haplotype", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: 50, individualsTotal: 25 }),
    ).toEqual({ ok: true, output: { haplotypeFrequency: 1 } }));
  it("rejects negative counts", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: -1, individualsTotal: 25 }).ok,
    ).toBe(false));
  it("rejects zero individuals", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: 12, individualsTotal: 0 }).ok,
    ).toBe(false));
  it("rejects fractional individuals", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: 12, individualsTotal: 2.5 }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runHaplotypeFrequency({ individualsTotal: 25 }).ok).toBe(false));
  it("rejects more haplotype copies than diploid chromosomes", () =>
    expect(
      runHaplotypeFrequency({ haplotypeCount: 21, individualsTotal: 10 }).ok,
    ).toBe(false));
});
