import { describe, expect, it } from "vitest";
import {
  calculateRandomHanunooCharacter,
  randomHanunooCharacterExample,
  randomHanunooCharacterValueCount,
  runRandomHanunooCharacter,
} from "./tool.js";

describe("Random Hanunoo Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomHanunooCharacter(randomHanunooCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᜠ" } });
    expect(
      runRandomHanunooCharacter(randomHanunooCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "᜶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomHanunooCharacterValueCount },
        (_, index) =>
          calculateRandomHanunooCharacter(
            () => (index + 0.5) / randomHanunooCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHanunooCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomHanunooCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
