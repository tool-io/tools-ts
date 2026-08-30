import { describe, expect, it } from "vitest";
import {
  calculateRandomRegionalIndicatorPair,
  randomRegionalIndicatorPairExample,
  randomRegionalIndicatorPairValueCount,
  runRandomRegionalIndicatorPair,
} from "./tool.js";

describe("Random Regional Indicator Pair Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomRegionalIndicatorPairExample))).toEqual(randomRegionalIndicatorPairExample);
    expect(runRandomRegionalIndicatorPair(randomRegionalIndicatorPairExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "🇦🇦" },
    });
    expect(runRandomRegionalIndicatorPair(randomRegionalIndicatorPairExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "🇿🇿" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomRegionalIndicatorPairValueCount },
        (_, index) =>
          calculateRandomRegionalIndicatorPair(
            () => (index + 0.5) / randomRegionalIndicatorPairValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomRegionalIndicatorPairValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomRegionalIndicatorPair({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomRegionalIndicatorPair({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
