import { describe, expect, it } from "vitest";
import {
  calculateRandomTaiVietCharacter,
  randomTaiVietCharacterExample,
  randomTaiVietCharacterValueCount,
  runRandomTaiVietCharacter,
} from "./tool.js";

describe("Random Tai Viet Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTaiVietCharacter(randomTaiVietCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꪀ" } });
    expect(
      runRandomTaiVietCharacter(randomTaiVietCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꫟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTaiVietCharacterValueCount },
        (_, index) =>
          calculateRandomTaiVietCharacter(
            () => (index + 0.5) / randomTaiVietCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTaiVietCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTaiVietCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
