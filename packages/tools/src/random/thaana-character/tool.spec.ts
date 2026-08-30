import { describe, expect, it } from "vitest";
import {
  calculateRandomThaanaCharacter,
  randomThaanaCharacterExample,
  randomThaanaCharacterValueCount,
  runRandomThaanaCharacter,
} from "./tool.js";

describe("Random Thaana Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomThaanaCharacter(randomThaanaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "،" } });
    expect(
      runRandomThaanaCharacter(randomThaanaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "﷽" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomThaanaCharacterValueCount },
        (_, index) =>
          calculateRandomThaanaCharacter(
            () => (index + 0.5) / randomThaanaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomThaanaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomThaanaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
