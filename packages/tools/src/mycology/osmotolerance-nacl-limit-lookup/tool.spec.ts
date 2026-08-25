import { describe, expect, it } from "vitest";
import {
  osmotoleranceNaclLimitLookupExample,
  runOsmotoleranceNaclLimitLookup,
} from "./tool.js";

describe("NaCl Limit Lookup", () => {
  const thresholds = {
    moderateMinimumPercent: 5,
    tolerantMinimumPercent: 10.1,
  };
  it("matches the canonical example", () =>
    expect(
      runOsmotoleranceNaclLimitLookup(
        osmotoleranceNaclLimitLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: osmotoleranceNaclLimitLookupExample.output,
    }));
  it("classes no salt tolerance as non-osmotolerant", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 0,
      }),
    ).toEqual({
      ok: true,
      output: { osmotoleranceClass: "non-osmotolerant" },
    }));
  it("classes just under five percent as non-osmotolerant", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 4.9,
      }),
    ).toEqual({
      ok: true,
      output: { osmotoleranceClass: "non-osmotolerant" },
    }));
  it("classes five percent as moderately osmotolerant", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 5,
      }),
    ).toEqual({
      ok: true,
      output: { osmotoleranceClass: "moderately-osmotolerant" },
    }));
  it("classes ten percent as moderately osmotolerant", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 10,
      }),
    ).toEqual({
      ok: true,
      output: { osmotoleranceClass: "moderately-osmotolerant" },
    }));
  it("classes just above ten percent as osmotolerant", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 10.1,
      }),
    ).toEqual({ ok: true, output: { osmotoleranceClass: "osmotolerant" } }));
  it("classes saturated growth as osmotolerant", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 25,
      }),
    ).toEqual({
      ok: true,
      output: { osmotoleranceClass: "osmotolerant" },
    }));
  it("rejects values above twenty-five percent", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: 25.5,
      }).ok,
    ).toBe(false));
  it("rejects negative values", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        ...thresholds,
        growthAtPercentNacl: -1,
      }).ok,
    ).toBe(false));
  it("rejects overlapping category thresholds", () =>
    expect(
      runOsmotoleranceNaclLimitLookup({
        growthAtPercentNacl: 8,
        moderateMinimumPercent: 10,
        tolerantMinimumPercent: 10,
      }).ok,
    ).toBe(false));
});
