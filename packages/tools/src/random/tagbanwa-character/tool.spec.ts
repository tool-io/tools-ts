import { describe, expect, it } from "vitest";
import {
  calculateRandomTagbanwaCharacter,
  randomTagbanwaCharacterExample,
  randomTagbanwaCharacterValueCount,
  runRandomTagbanwaCharacter,
} from "./tool.js";

describe("Random Tagbanwa Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTagbanwaCharacter(randomTagbanwaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "᜵" } });
    expect(
      runRandomTagbanwaCharacter(randomTagbanwaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᝳ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTagbanwaCharacterValueCount },
        (_, index) =>
          calculateRandomTagbanwaCharacter(
            () => (index + 0.5) / randomTagbanwaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTagbanwaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTagbanwaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
