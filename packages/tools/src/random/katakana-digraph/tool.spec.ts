import { describe, expect, it } from "vitest";
import {
  calculateRandomKatakanaDigraph,
  randomKatakanaDigraphExample,
  randomKatakanaDigraphValueCount,
  runRandomKatakanaDigraph,
} from "./tool.js";

describe("Random Katakana Digraph Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomKatakanaDigraphExample))).toEqual(randomKatakanaDigraphExample);
    expect(runRandomKatakanaDigraph(randomKatakanaDigraphExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "キャ" },
    });
    expect(runRandomKatakanaDigraph(randomKatakanaDigraphExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ピョ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomKatakanaDigraphValueCount },
        (_, index) =>
          calculateRandomKatakanaDigraph(
            () => (index + 0.5) / randomKatakanaDigraphValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKatakanaDigraphValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomKatakanaDigraph({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomKatakanaDigraph({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
