import { describe, expect, it } from "vitest";
import {
  calculateRandomMasaramGondiCharacter,
  randomMasaramGondiCharacterExample,
  randomMasaramGondiCharacterValueCount,
  runRandomMasaramGondiCharacter,
} from "./tool.js";

describe("Random Masaram Gondi Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMasaramGondiCharacter(randomMasaramGondiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomMasaramGondiCharacter(randomMasaramGondiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑵙" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMasaramGondiCharacterValueCount },
        (_, index) =>
          calculateRandomMasaramGondiCharacter(
            () => (index + 0.5) / randomMasaramGondiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMasaramGondiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomMasaramGondiCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
