import { describe, expect, it } from "vitest";
import {
  heterozygosityObservedExample,
  runHeterozygosityObserved,
} from "./tool.js";

describe("Observed Heterozygosity", () => {
  it("matches the canonical example", () => {
    expect(
      runHeterozygosityObserved(heterozygosityObservedExample.input),
    ).toEqual({
      ok: true,
      output: heterozygosityObservedExample.output,
    });
  });
  it("returns zero with no heterozygotes", () =>
    expect(
      runHeterozygosityObserved({ heterozygotes: 0, totalIndividuals: 12 }),
    ).toEqual({
      ok: true,
      output: { observedHeterozygosity: 0 },
    }));
  it("returns one when all individuals are heterozygous", () =>
    expect(
      runHeterozygosityObserved({ heterozygotes: 8, totalIndividuals: 8 }),
    ).toEqual({
      ok: true,
      output: { observedHeterozygosity: 1 },
    }));
  it("computes fractional heterozygosity", () =>
    expect(
      runHeterozygosityObserved({ heterozygotes: 1, totalIndividuals: 3 }),
    ).toEqual({
      ok: true,
      output: { observedHeterozygosity: 0.3333333333333333 },
    }));
  it("rejects a zero total", () =>
    expect(
      runHeterozygosityObserved({ heterozygotes: 1, totalIndividuals: 0 }).ok,
    ).toBe(false));
  it("rejects negative inputs", () =>
    expect(
      runHeterozygosityObserved({ heterozygotes: -1, totalIndividuals: 4 }).ok,
    ).toBe(false));
  it("rejects heterozygotes above the total", () =>
    expect(
      runHeterozygosityObserved({ heterozygotes: 9, totalIndividuals: 8 }).ok,
    ).toBe(false));
});
