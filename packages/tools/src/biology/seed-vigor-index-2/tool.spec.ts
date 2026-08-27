import { describe, expect, it } from "vitest";
import { runSeedVigorIndex2, seedVigorIndex2Example } from "./tool.js";

describe("Vigorous Seedling Index", () => {
  it("publishes an executable example", () =>
    expect(runSeedVigorIndex2(seedVigorIndex2Example.input)).toEqual({
      ok: true,
      output: seedVigorIndex2Example.output,
    }));
  it("returns zero for zero germination", () =>
    expect(
      runSeedVigorIndex2({
        germinationPercentNumber: 0,
        seedlingDryMassMg: 12,
      }),
    ).toEqual({ ok: true, output: { vigorousSeedlingIndex: 0 } }));
  it("returns zero for zero mass", () =>
    expect(
      runSeedVigorIndex2({
        germinationPercentNumber: 90,
        seedlingDryMassMg: 0,
      }),
    ).toEqual({ ok: true, output: { vigorousSeedlingIndex: 0 } }));
  it("scales linearly with the germination percentage", () =>
    expect(
      runSeedVigorIndex2({
        germinationPercentNumber: 50,
        seedlingDryMassMg: 8,
      }),
    ).toEqual({ ok: true, output: { vigorousSeedlingIndex: 4 } }));
  it("rejects negative mass", () =>
    expect(
      runSeedVigorIndex2({
        germinationPercentNumber: 90,
        seedlingDryMassMg: -1,
      }).ok,
    ).toBe(false));
  it("rejects germination above one hundred", () =>
    expect(
      runSeedVigorIndex2({
        germinationPercentNumber: 101,
        seedlingDryMassMg: 12,
      }).ok,
    ).toBe(false));
});
