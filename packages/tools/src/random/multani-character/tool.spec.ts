import { describe, expect, it } from "vitest";
import {
  calculateRandomMultaniCharacter,
  randomMultaniCharacterExample,
  randomMultaniCharacterValueCount,
  runRandomMultaniCharacter,
} from "./tool.js";

describe("Random Multani Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMultaniCharacter(randomMultaniCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "੦" } });
    expect(
      runRandomMultaniCharacter(randomMultaniCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑊩" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMultaniCharacterValueCount },
        (_, index) =>
          calculateRandomMultaniCharacter(
            () => (index + 0.5) / randomMultaniCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMultaniCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMultaniCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
