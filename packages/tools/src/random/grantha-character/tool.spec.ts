import { describe, expect, it } from "vitest";
import {
  calculateRandomGranthaCharacter,
  randomGranthaCharacterExample,
  randomGranthaCharacterValueCount,
  runRandomGranthaCharacter,
} from "./tool.js";

describe("Random Grantha Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGranthaCharacter(randomGranthaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomGranthaCharacter(randomGranthaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑿓" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGranthaCharacterValueCount },
        (_, index) =>
          calculateRandomGranthaCharacter(
            () => (index + 0.5) / randomGranthaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGranthaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGranthaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
