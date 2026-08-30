import { describe, expect, it } from "vitest";
import {
  calculateRandomCypriotSyllable,
  randomCypriotSyllableExample,
  randomCypriotSyllableValueCount,
  runRandomCypriotSyllable,
} from "./tool.js";

describe("Random Cypriot Syllable Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCypriotSyllable(randomCypriotSyllableExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐠀" } });
    expect(
      runRandomCypriotSyllable(randomCypriotSyllableExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐠿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCypriotSyllableValueCount },
        (_, index) =>
          calculateRandomCypriotSyllable(
            () => (index + 0.5) / randomCypriotSyllableValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCypriotSyllableValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCypriotSyllable({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
