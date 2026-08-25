import { describe, expect, it } from "vitest";
import { runCodonUsageBias } from "./tool.js";

describe("Codon Usage Bias Frequency", () => {
  it("calculates a valid result", () =>
    expect(
      runCodonUsageBias({
        codonOccurrences: 12,
        totalCodonsOfThatAminoAcid: 48,
      }),
    ).toEqual({ ok: true, output: { usageFrequency: 0.25 } }));
  it("reports exclusive usage as one", () =>
    expect(
      runCodonUsageBias({
        codonOccurrences: 20,
        totalCodonsOfThatAminoAcid: 20,
      }),
    ).toEqual({ ok: true, output: { usageFrequency: 1 } }));
  it("reports unused codons as zero", () =>
    expect(
      runCodonUsageBias({
        codonOccurrences: 0,
        totalCodonsOfThatAminoAcid: 35,
      }),
    ).toEqual({ ok: true, output: { usageFrequency: 0 } }));
  it("splits evenly between two synonymous codons", () =>
    expect(
      runCodonUsageBias({
        codonOccurrences: 17,
        totalCodonsOfThatAminoAcid: 34,
      }),
    ).toEqual({ ok: true, output: { usageFrequency: 0.5 } }));
  it("rejects a zero denominator", () => {
    const result = runCodonUsageBias({
      codonOccurrences: 5,
      totalCodonsOfThatAminoAcid: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_total");
  });
  it("rejects occurrences exceeding the amino acid total", () => {
    const result = runCodonUsageBias({
      codonOccurrences: 49,
      totalCodonsOfThatAminoAcid: 48,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("exceeds_total");
  });
  it("rejects fractional occurrences", () =>
    expect(
      runCodonUsageBias({
        codonOccurrences: 1.5,
        totalCodonsOfThatAminoAcid: 48,
      }).ok,
    ).toBe(false));
});
