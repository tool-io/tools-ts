import { describe, expect, it } from "vitest";
import {
  calculateRandomAdlamCharacter,
  randomAdlamCharacterExample,
  randomAdlamCharacterValueCount,
  runRandomAdlamCharacter,
} from "./tool.js";

describe("Random Adlam Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAdlamCharacter(randomAdlamCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "؟" } });
    expect(
      runRandomAdlamCharacter(randomAdlamCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞥟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAdlamCharacterValueCount },
        (_, index) =>
          calculateRandomAdlamCharacter(
            () => (index + 0.5) / randomAdlamCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAdlamCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAdlamCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
