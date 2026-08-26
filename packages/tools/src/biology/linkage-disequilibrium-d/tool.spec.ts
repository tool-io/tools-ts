import { describe, expect, it } from "vitest";
import {
  linkageDisequilibriumDExample,
  runLinkageDisequilibriumD,
} from "./tool.js";

describe("LD Coefficient D", () => {
  it("publishes an executable example", () =>
    expect(
      runLinkageDisequilibriumD(linkageDisequilibriumDExample.input),
    ).toEqual({ ok: true, output: linkageDisequilibriumDExample.output }));
  it("subtracts the allele frequency product from the haplotype frequency", () =>
    expect(
      runLinkageDisequilibriumD({
        alleleAFrequency: 0.5,
        alleleBFrequency: 0.4,
        haplotypeABFrequency: 0.3,
      }),
    ).toEqual({
      ok: true,
      output: { dCoefficient: 0.09999999999999998 },
    }));
  it("returns a signed negative coefficient", () =>
    expect(
      runLinkageDisequilibriumD({
        alleleAFrequency: 0.5,
        alleleBFrequency: 0.5,
        haplotypeABFrequency: 0.05,
      }),
    ).toEqual({ ok: true, output: { dCoefficient: -0.2 } }));
  it("returns zero when alleles are uncorrelated", () =>
    expect(
      runLinkageDisequilibriumD({
        alleleAFrequency: 0,
        alleleBFrequency: 0.4,
        haplotypeABFrequency: 0,
      }),
    ).toEqual({ ok: true, output: { dCoefficient: 0 } }));
  it("accepts fixed alleles at the boundaries", () =>
    expect(
      runLinkageDisequilibriumD({
        alleleAFrequency: 1,
        alleleBFrequency: 1,
        haplotypeABFrequency: 1,
      }),
    ).toEqual({ ok: true, output: { dCoefficient: 0 } }));
  it("rejects frequencies above one", () =>
    expect(
      runLinkageDisequilibriumD({
        alleleAFrequency: 0.5,
        alleleBFrequency: 0.4,
        haplotypeABFrequency: 1.2,
      }).ok,
    ).toBe(false));
  it("rejects negative frequencies", () =>
    expect(
      runLinkageDisequilibriumD({
        alleleAFrequency: -0.1,
        alleleBFrequency: 0.4,
        haplotypeABFrequency: 0.3,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runLinkageDisequilibriumD({ alleleAFrequency: 0.5 }).ok).toBe(
      false,
    ));
});
