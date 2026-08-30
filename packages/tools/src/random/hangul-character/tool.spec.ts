import { describe, expect, it } from "vitest";
import {
  calculateRandomHangulCharacter,
  randomHangulCharacterExample,
  randomHangulCharacterValueCount,
  runRandomHangulCharacter,
} from "./tool.js";

describe("Random Hangul Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomHangulCharacter(randomHangulCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᄀ" } });
    expect(
      runRandomHangulCharacter(randomHangulCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ￜ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomHangulCharacterValueCount },
        (_, index) =>
          calculateRandomHangulCharacter(
            () => (index + 0.5) / randomHangulCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomHangulCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomHangulCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
