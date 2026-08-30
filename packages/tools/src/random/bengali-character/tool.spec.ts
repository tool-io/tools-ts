import { describe, expect, it } from "vitest";
import {
  calculateRandomBengaliCharacter,
  randomBengaliCharacterExample,
  randomBengaliCharacterValueCount,
  runRandomBengaliCharacter,
} from "./tool.js";

describe("Random Bengali Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBengaliCharacter(randomBengaliCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ʼ" } });
    expect(
      runRandomBengaliCharacter(randomBengaliCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑷱" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBengaliCharacterValueCount },
        (_, index) =>
          calculateRandomBengaliCharacter(
            () => (index + 0.5) / randomBengaliCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBengaliCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBengaliCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
