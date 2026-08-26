import { describe, expect, it } from "vitest";
import { logSeriesAlphaProxyExample, runLogSeriesAlphaProxy } from "./tool.js";

describe("Log Series Alpha Proxy", () => {
  it("publishes an executable example", () =>
    expect(runLogSeriesAlphaProxy(logSeriesAlphaProxyExample.input)).toEqual({
      ok: true,
      output: logSeriesAlphaProxyExample.output,
    }));
  it("uses the natural logarithm of N plus one", () =>
    expect(
      runLogSeriesAlphaProxy({ speciesCountInt: 25, totalIndividualsInt: 199 }),
    ).toEqual({
      ok: true,
      output: { logSeriesAlphaProxy: 4.7184791454438715 },
    }));
  it("accepts the smallest community", () =>
    expect(
      runLogSeriesAlphaProxy({ speciesCountInt: 1, totalIndividualsInt: 1 }),
    ).toEqual({
      ok: true,
      output: { logSeriesAlphaProxy: 1 / Math.log(2) },
    }));
  it("grows with species count at fixed individuals", () => {
    const sparse = runLogSeriesAlphaProxySafe({
      speciesCountInt: 5,
      totalIndividualsInt: 300,
    });
    const rich = runLogSeriesAlphaProxySafe({
      speciesCountInt: 40,
      totalIndividualsInt: 300,
    });
    expect(rich).toBeGreaterThan(sparse);
  });
  it("stays positive for large censuses", () => {
    const result = runLogSeriesAlphaProxySafe({
      speciesCountInt: 120,
      totalIndividualsInt: 99999,
    });
    expect(result).toBeGreaterThan(0);
  });
  it("rejects zero species counts", () =>
    expect(
      runLogSeriesAlphaProxy({ speciesCountInt: 0, totalIndividualsInt: 50 })
        .ok,
    ).toBe(false));
  it("rejects zero individuals", () =>
    expect(
      runLogSeriesAlphaProxy({ speciesCountInt: 5, totalIndividualsInt: 0 }).ok,
    ).toBe(false));
});

const runLogSeriesAlphaProxySafe = (input: {
  readonly speciesCountInt: number;
  readonly totalIndividualsInt: number;
}): number => {
  const result = runLogSeriesAlphaProxy(input);
  if (!result.ok) throw new Error("expected success");
  return Number(result.output.logSeriesAlphaProxy);
};
