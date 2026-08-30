import { describe, expect, it } from "vitest";
import {
  calculateRandomDevanagariCharacter,
  randomDevanagariCharacterExample,
  randomDevanagariCharacterValueCount,
  runRandomDevanagariCharacter,
} from "./tool.js";

describe("Random Devanagari Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDevanagariCharacter(randomDevanagariCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ʼ" } });
    expect(
      runRandomDevanagariCharacter(randomDevanagariCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑬊" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDevanagariCharacterValueCount },
        (_, index) =>
          calculateRandomDevanagariCharacter(
            () => (index + 0.5) / randomDevanagariCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDevanagariCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDevanagariCharacter({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
