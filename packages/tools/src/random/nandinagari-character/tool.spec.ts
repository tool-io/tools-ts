import { describe, expect, it } from "vitest";
import {
  calculateRandomNandinagariCharacter,
  randomNandinagariCharacterExample,
  randomNandinagariCharacterValueCount,
  runRandomNandinagariCharacter,
} from "./tool.js";

describe("Random Nandinagari Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNandinagariCharacter(randomNandinagariCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomNandinagariCharacter(randomNandinagariCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑧤" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNandinagariCharacterValueCount },
        (_, index) =>
          calculateRandomNandinagariCharacter(
            () => (index + 0.5) / randomNandinagariCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNandinagariCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomNandinagariCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
