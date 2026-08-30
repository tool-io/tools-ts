import { describe, expect, it } from "vitest";
import {
  calculateRandomMiaoCharacter,
  randomMiaoCharacterExample,
  randomMiaoCharacterValueCount,
  runRandomMiaoCharacter,
} from "./tool.js";

describe("Random Miao Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMiaoCharacter(randomMiaoCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖼀" } });
    expect(
      runRandomMiaoCharacter(randomMiaoCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖾟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMiaoCharacterValueCount },
        (_, index) =>
          calculateRandomMiaoCharacter(
            () => (index + 0.5) / randomMiaoCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMiaoCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMiaoCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
