import { describe, expect, it } from "vitest";
import { runOligoMolecularWeight } from "./tool.js";

describe("Oligo MW Approx", () => {
  it("approximates a twenty-one-mer as six thousand nine hundred thirty daltons", () =>
    expect(runOligoMolecularWeight({ lengthNt: 21 })).toEqual({
      ok: true,
      output: { oligoMolecularWeightDa: 6930 },
    }));
  it("approximates a twenty-mer as six thousand six hundred daltons", () =>
    expect(runOligoMolecularWeight({ lengthNt: 20 })).toEqual({
      ok: true,
      output: { oligoMolecularWeightDa: 6600 },
    }));
  it("approximates a single nucleotide as three hundred thirty daltons", () =>
    expect(runOligoMolecularWeight({ lengthNt: 1 })).toEqual({
      ok: true,
      output: { oligoMolecularWeightDa: 330 },
    }));
  it("approximates a sixty-mer as nineteen thousand eight hundred daltons", () =>
    expect(runOligoMolecularWeight({ lengthNt: 60 })).toEqual({
      ok: true,
      output: { oligoMolecularWeightDa: 19800 },
    }));
  it("rejects zero length", () =>
    expect(runOligoMolecularWeight({ lengthNt: 0 }).ok).toBe(false));
  it("rejects fractional lengths", () =>
    expect(runOligoMolecularWeight({ lengthNt: 21.5 }).ok).toBe(false));
});
