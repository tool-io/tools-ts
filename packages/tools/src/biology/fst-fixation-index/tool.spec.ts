import { describe, expect, it } from "vitest";
import { fstFixationIndexExample, runFstFixationIndex } from "./tool.js";

describe("FST Fixation Index", () => {
  it("matches the canonical example", () => {
    const result = runFstFixationIndex(fstFixationIndexExample.input);
    expect(result).toEqual({
      ok: true,
      output: fstFixationIndexExample.output,
    });
  });
  it("returns zero for equal allele frequencies", () =>
    expect(
      runFstFixationIndex({ alleleFrequencyX: 0.45, alleleFrequencyY: 0.45 }),
    ).toEqual({ ok: true, output: { fixationIndexFst: 0 } }));
  it("returns one for opposite fixation", () =>
    expect(
      runFstFixationIndex({ alleleFrequencyX: 1, alleleFrequencyY: 0 }),
    ).toEqual({ ok: true, output: { fixationIndexFst: 1 } }));
  it("increases with frequency divergence", () => {
    const small = runFstFixationIndex({
      alleleFrequencyX: 0.5,
      alleleFrequencyY: 0.6,
    });
    const large = runFstFixationIndex({
      alleleFrequencyX: 0.5,
      alleleFrequencyY: 0.95,
    });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok && large.ok)
      expect(large.output.fixationIndexFst).toBeGreaterThan(
        Number(small.output.fixationIndexFst),
      );
  });
  it("rejects identical fully fixed populations", () =>
    expect(
      runFstFixationIndex({ alleleFrequencyX: 1, alleleFrequencyY: 1 }).ok,
    ).toBe(false));
  it("rejects p above one", () =>
    expect(
      runFstFixationIndex({ alleleFrequencyX: 1.5, alleleFrequencyY: 0.2 }).ok,
    ).toBe(false));
  it("rejects negative p", () =>
    expect(
      runFstFixationIndex({ alleleFrequencyX: 0.3, alleleFrequencyY: -0.2 }).ok,
    ).toBe(false));
});
