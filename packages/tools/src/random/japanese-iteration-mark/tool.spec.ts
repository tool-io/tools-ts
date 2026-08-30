import { describe, expect, it } from "vitest";
import {
  calculateRandomJapaneseIterationMark,
  randomJapaneseIterationMarkExample,
  randomJapaneseIterationMarkValueCount,
  runRandomJapaneseIterationMark,
} from "./tool.js";

describe("Random Japanese Iteration Mark Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomJapaneseIterationMarkExample))).toEqual(randomJapaneseIterationMarkExample);
    expect(runRandomJapaneseIterationMark(randomJapaneseIterationMarkExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "々" },
    });
    expect(runRandomJapaneseIterationMark(randomJapaneseIterationMarkExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ヾ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomJapaneseIterationMarkValueCount },
        (_, index) =>
          calculateRandomJapaneseIterationMark(
            () => (index + 0.5) / randomJapaneseIterationMarkValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomJapaneseIterationMarkValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomJapaneseIterationMark({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomJapaneseIterationMark({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
