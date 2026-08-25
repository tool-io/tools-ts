import { describe, expect, it } from "vitest";
import { chlorophyllAbRatioExample, runChlorophyllAbRatio } from "./tool.js";

describe("Chl a/b Ratio", () => {
  it("publishes an executable example", () =>
    expect(runChlorophyllAbRatio(chlorophyllAbRatioExample.input)).toEqual({
      ok: true,
      output: chlorophyllAbRatioExample.output,
    }));
  it("returns zero when chlorophyll a is absent", () =>
    expect(
      runChlorophyllAbRatio({ chlorophyllAUgmL: 0, chlorophyllBUgmL: 5 }),
    ).toEqual({
      ok: true,
      output: { chlorophyllABRatio: 0 },
    }));
  it("supports fractional ratios", () => {
    const result = runChlorophyllAbRatio({
      chlorophyllAUgmL: 1,
      chlorophyllBUgmL: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.chlorophyllABRatio).toBeCloseTo(0.25, 12);
  });
  it("rejects zero chlorophyll b", () =>
    expect(
      runChlorophyllAbRatio({ chlorophyllAUgmL: 2, chlorophyllBUgmL: 0 }).ok,
    ).toBe(false));
  it("rejects negative chlorophyll b", () =>
    expect(
      runChlorophyllAbRatio({ chlorophyllAUgmL: 2, chlorophyllBUgmL: -1 }).ok,
    ).toBe(false));
  it("rejects negative chlorophyll a", () =>
    expect(
      runChlorophyllAbRatio({ chlorophyllAUgmL: -0.1, chlorophyllBUgmL: 1 }).ok,
    ).toBe(false));
});
