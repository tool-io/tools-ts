import { describe, expect, it } from "vitest";
import {
  calculateRandomNewaCharacter,
  randomNewaCharacterExample,
  randomNewaCharacterValueCount,
  runRandomNewaCharacter,
} from "./tool.js";

describe("Random Newa Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNewaCharacter(randomNewaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomNewaCharacter(randomNewaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑑡" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNewaCharacterValueCount },
        (_, index) =>
          calculateRandomNewaCharacter(
            () => (index + 0.5) / randomNewaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNewaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomNewaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
