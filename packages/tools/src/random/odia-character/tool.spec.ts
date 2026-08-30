import { describe, expect, it } from "vitest";
import {
  calculateRandomOdiaCharacter,
  randomOdiaCharacterExample,
  randomOdiaCharacterValueCount,
  runRandomOdiaCharacter,
} from "./tool.js";

describe("Random Odia Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOdiaCharacter(randomOdiaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomOdiaCharacter(randomOdiaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᳲ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOdiaCharacterValueCount },
        (_, index) =>
          calculateRandomOdiaCharacter(
            () => (index + 0.5) / randomOdiaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOdiaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOdiaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
