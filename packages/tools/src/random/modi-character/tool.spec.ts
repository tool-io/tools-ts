import { describe, expect, it } from "vitest";
import {
  calculateRandomModiCharacter,
  randomModiCharacterExample,
  randomModiCharacterValueCount,
  runRandomModiCharacter,
} from "./tool.js";

describe("Random Modi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomModiCharacter(randomModiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "꠰" } });
    expect(
      runRandomModiCharacter(randomModiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑙙" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomModiCharacterValueCount },
        (_, index) =>
          calculateRandomModiCharacter(
            () => (index + 0.5) / randomModiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomModiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomModiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
