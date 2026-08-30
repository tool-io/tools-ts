import { describe, expect, it } from "vitest";
import {
  calculateRandomHiraganaDigraph,
  randomHiraganaDigraphExample,
  randomHiraganaDigraphValueCount,
  runRandomHiraganaDigraph,
} from "./tool.js";

describe("Random Hiragana Digraph Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomHiraganaDigraphExample))).toEqual(randomHiraganaDigraphExample);
    expect(runRandomHiraganaDigraph(randomHiraganaDigraphExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "きゃ" },
    });
    expect(runRandomHiraganaDigraph(randomHiraganaDigraphExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ぴょ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomHiraganaDigraphValueCount },
        (_, index) =>
          calculateRandomHiraganaDigraph(
            () => (index + 0.5) / randomHiraganaDigraphValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHiraganaDigraphValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomHiraganaDigraph({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomHiraganaDigraph({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
