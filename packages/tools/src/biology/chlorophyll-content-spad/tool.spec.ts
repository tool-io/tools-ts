import { describe, expect, it } from "vitest";
import {
  chlorophyllContentSpadExample,
  runChlorophyllContentSpad,
} from "./tool.js";

describe("SPAD To Chlorophyll", () => {
  it("publishes an executable example", () =>
    expect(
      runChlorophyllContentSpad(chlorophyllContentSpadExample.input),
    ).toEqual({
      ok: true,
      output: chlorophyllContentSpadExample.output,
    }));
  it("applies the documented default factor of 0.4", () => {
    const result = runChlorophyllContentSpad({ spadValue: 25 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.chlorophyllEstimateUGPerCm2).toBe(10);
  });
  it("scales with a custom conversion factor", () =>
    expect(
      runChlorophyllContentSpad({ conversionFactor: 1.5, spadValue: 50 }),
    ).toEqual({ ok: true, output: { chlorophyllEstimateUGPerCm2: 75 } }));
  it("accepts the maximum factor of two", () =>
    expect(
      runChlorophyllContentSpad({ conversionFactor: 2, spadValue: 40 }),
    ).toEqual({
      ok: true,
      output: { chlorophyllEstimateUGPerCm2: 80 },
    }));
  it("returns zero for a zero reading", () =>
    expect(runChlorophyllContentSpad({ spadValue: 0 })).toEqual({
      ok: true,
      output: { chlorophyllEstimateUGPerCm2: 0 },
    }));
  it("supports fractional readings", () =>
    expect(runChlorophyllContentSpad({ spadValue: 12.5 })).toEqual({
      ok: true,
      output: { chlorophyllEstimateUGPerCm2: 5 },
    }));
  it("rejects negative SPAD values", () =>
    expect(runChlorophyllContentSpad({ spadValue: -1 }).ok).toBe(false));
  it("rejects factors outside zero through two", () => {
    expect(
      runChlorophyllContentSpad({ conversionFactor: 2.5, spadValue: 40 }).ok,
    ).toBe(false);
    expect(
      runChlorophyllContentSpad({ conversionFactor: -0.5, spadValue: 40 }).ok,
    ).toBe(false);
  });
});
