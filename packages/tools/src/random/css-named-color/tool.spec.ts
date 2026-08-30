import { describe, expect, it } from "vitest";
import {
  calculateRandomCssNamedColor,
  randomCssNamedColorExample,
  randomCssNamedColorValueCount,
  runRandomCssNamedColor,
} from "./tool.js";

describe("Random CSS Named Color Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomCssNamedColorExample))).toEqual(randomCssNamedColorExample);
    expect(runRandomCssNamedColor(randomCssNamedColorExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "aliceblue" },
    });
    expect(runRandomCssNamedColor(randomCssNamedColorExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "yellowgreen" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomCssNamedColorValueCount },
        (_, index) =>
          calculateRandomCssNamedColor(
            () => (index + 0.5) / randomCssNamedColorValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCssNamedColorValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomCssNamedColor({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomCssNamedColor({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
