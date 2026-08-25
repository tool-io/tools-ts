import { describe, expect, it } from "vitest";
import { runBreedingValue } from "./tool.js";

describe("Breeding Value EBV", () => {
  it("scales the phenotype deviation by heritability", () =>
    expect(
      runBreedingValue({ heritability: 0.6, phenotypeDeviation: 5 }),
    ).toEqual({ ok: true, output: { estimatedBreedingValue: 3 } }));
  it("returns a negative value below the population mean", () =>
    expect(
      runBreedingValue({ heritability: 0.5, phenotypeDeviation: -4 }),
    ).toEqual({ ok: true, output: { estimatedBreedingValue: -2 } }));
  it("yields zero for an average phenotype", () =>
    expect(
      runBreedingValue({ heritability: 0.7, phenotypeDeviation: 0 }),
    ).toEqual({ ok: true, output: { estimatedBreedingValue: 0 } }));
  it("yields zero when traits are not heritable", () =>
    expect(
      runBreedingValue({ heritability: 0, phenotypeDeviation: 12 }),
    ).toEqual({ ok: true, output: { estimatedBreedingValue: 0 } }));
  it("passes the deviation through at unit heritability", () =>
    expect(
      runBreedingValue({ heritability: 1, phenotypeDeviation: 7.25 }),
    ).toEqual({ ok: true, output: { estimatedBreedingValue: 7.25 } }));
  it("rejects out of range heritability", () => {
    const result = runBreedingValue({
      heritability: -0.1,
      phenotypeDeviation: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
