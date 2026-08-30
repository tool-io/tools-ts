import { describe, expect, it } from "vitest";
import {
  calculateRandomYiSyllable,
  randomYiSyllableExample,
  randomYiSyllableValueCount,
  runRandomYiSyllable,
} from "./tool.js";

describe("Random Yi Syllable Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomYiSyllable(randomYiSyllableExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "ꀀ" } });
    expect(
      runRandomYiSyllable(randomYiSyllableExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ꒌ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomYiSyllableValueCount },
        (_, index) =>
          calculateRandomYiSyllable(
            () => (index + 0.5) / randomYiSyllableValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomYiSyllableValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomYiSyllable({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
