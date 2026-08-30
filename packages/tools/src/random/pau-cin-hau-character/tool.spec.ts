import { describe, expect, it } from "vitest";
import {
  calculateRandomPauCinHauCharacter,
  randomPauCinHauCharacterExample,
  randomPauCinHauCharacterValueCount,
  runRandomPauCinHauCharacter,
} from "./tool.js";

describe("Random Pau Cin Hau Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPauCinHauCharacter(randomPauCinHauCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑫀" } });
    expect(
      runRandomPauCinHauCharacter(randomPauCinHauCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑫸" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPauCinHauCharacterValueCount },
        (_, index) =>
          calculateRandomPauCinHauCharacter(
            () => (index + 0.5) / randomPauCinHauCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPauCinHauCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomPauCinHauCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
