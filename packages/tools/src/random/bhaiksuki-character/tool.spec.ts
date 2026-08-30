import { describe, expect, it } from "vitest";
import {
  calculateRandomBhaiksukiCharacter,
  randomBhaiksukiCharacterExample,
  randomBhaiksukiCharacterValueCount,
  runRandomBhaiksukiCharacter,
} from "./tool.js";

describe("Random Bhaiksuki Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBhaiksukiCharacter(randomBhaiksukiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑰀" } });
    expect(
      runRandomBhaiksukiCharacter(randomBhaiksukiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑱬" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBhaiksukiCharacterValueCount },
        (_, index) =>
          calculateRandomBhaiksukiCharacter(
            () => (index + 0.5) / randomBhaiksukiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBhaiksukiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBhaiksukiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
