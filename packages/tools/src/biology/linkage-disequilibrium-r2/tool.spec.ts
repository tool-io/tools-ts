import { describe, expect, it } from "vitest";
import {
  linkageDisequilibriumR2Example,
  runLinkageDisequilibriumR2,
} from "./tool.js";

describe("LD R-Squared", () => {
  it("publishes an executable example", () =>
    expect(
      runLinkageDisequilibriumR2(linkageDisequilibriumR2Example.input),
    ).toEqual({ ok: true, output: linkageDisequilibriumR2Example.output }));
  it("ignores the sign of D", () =>
    expect(
      runLinkageDisequilibriumR2({
        alleleAFrequency: 0.5,
        alleleBFrequency: 0.5,
        dCoefficient: -0.25,
      }),
    ).toEqual({ ok: true, output: { rSquared: 1 } }));
  it("normalizes D by the allele frequency product", () =>
    expect(
      runLinkageDisequilibriumR2({
        alleleAFrequency: 0.5,
        alleleBFrequency: 0.5,
        dCoefficient: 0.1,
      }),
    ).toEqual({ ok: true, output: { rSquared: 0.16000000000000003 } }));
  it("reports monomorphic locus for a fixed A allele", () => {
    const result = runLinkageDisequilibriumR2({
      alleleAFrequency: 1,
      alleleBFrequency: 0.5,
      dCoefficient: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("monomorphic_locus");
  });
  it("reports monomorphic locus for an absent B allele", () => {
    const result = runLinkageDisequilibriumR2({
      alleleAFrequency: 0.5,
      alleleBFrequency: 0,
      dCoefficient: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("monomorphic_locus");
  });
  it("rejects out-of-range allele frequencies", () =>
    expect(
      runLinkageDisequilibriumR2({
        alleleAFrequency: 0.5,
        alleleBFrequency: 1.5,
        dCoefficient: 0.1,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runLinkageDisequilibriumR2({ dCoefficient: 0.25 }).ok).toBe(false));
});
