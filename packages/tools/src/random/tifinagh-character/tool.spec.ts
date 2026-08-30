import { describe, expect, it } from "vitest";
import {
  calculateRandomTifinaghCharacter,
  randomTifinaghCharacterExample,
  randomTifinaghCharacterValueCount,
  runRandomTifinaghCharacter,
} from "./tool.js";

describe("Random Tifinagh Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTifinaghCharacter(randomTifinaghCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "̂" } });
    expect(
      runRandomTifinaghCharacter(randomTifinaghCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "⵿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTifinaghCharacterValueCount },
        (_, index) =>
          calculateRandomTifinaghCharacter(
            () => (index + 0.5) / randomTifinaghCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTifinaghCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTifinaghCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
