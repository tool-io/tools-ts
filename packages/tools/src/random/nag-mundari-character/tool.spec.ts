import { describe, expect, it } from "vitest";
import {
  calculateRandomNagMundariCharacter,
  randomNagMundariCharacterExample,
  randomNagMundariCharacterValueCount,
  runRandomNagMundariCharacter,
} from "./tool.js";

describe("Random Nag Mundari Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNagMundariCharacter(randomNagMundariCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𞓐" } });
    expect(
      runRandomNagMundariCharacter(randomNagMundariCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞓹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNagMundariCharacterValueCount },
        (_, index) =>
          calculateRandomNagMundariCharacter(
            () => (index + 0.5) / randomNagMundariCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNagMundariCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomNagMundariCharacter({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
