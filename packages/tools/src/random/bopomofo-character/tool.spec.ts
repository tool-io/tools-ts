import { describe, expect, it } from "vitest";
import {
  calculateRandomBopomofoCharacter,
  randomBopomofoCharacterExample,
  randomBopomofoCharacterValueCount,
  runRandomBopomofoCharacter,
} from "./tool.js";

describe("Random Bopomofo Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBopomofoCharacter(randomBopomofoCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ˇ" } });
    expect(
      runRandomBopomofoCharacter(randomBopomofoCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "･" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBopomofoCharacterValueCount },
        (_, index) =>
          calculateRandomBopomofoCharacter(
            () => (index + 0.5) / randomBopomofoCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBopomofoCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBopomofoCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
