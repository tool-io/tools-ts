import { describe, expect, it } from "vitest";
import {
  calculateRandomBuhidCharacter,
  randomBuhidCharacterExample,
  randomBuhidCharacterValueCount,
  runRandomBuhidCharacter,
} from "./tool.js";

describe("Random Buhid Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBuhidCharacter(randomBuhidCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "᜵" } });
    expect(
      runRandomBuhidCharacter(randomBuhidCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᝓ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBuhidCharacterValueCount },
        (_, index) =>
          calculateRandomBuhidCharacter(
            () => (index + 0.5) / randomBuhidCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBuhidCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBuhidCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
