import { describe, expect, it } from "vitest";
import {
  calculateRandomVaiCharacter,
  randomVaiCharacterExample,
  randomVaiCharacterValueCount,
  runRandomVaiCharacter,
} from "./tool.js";

describe("Random Vai Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomVaiCharacter(randomVaiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ꔀ" } });
    expect(
      runRandomVaiCharacter(randomVaiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ꘫ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomVaiCharacterValueCount },
        (_, index) =>
          calculateRandomVaiCharacter(
            () => (index + 0.5) / randomVaiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomVaiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomVaiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
