import { describe, expect, it } from "vitest";
import {
  calculateRandomMahajaniCharacter,
  randomMahajaniCharacterExample,
  randomMahajaniCharacterValueCount,
  runRandomMahajaniCharacter,
} from "./tool.js";

describe("Random Mahajani Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMahajaniCharacter(randomMahajaniCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "·" } });
    expect(
      runRandomMahajaniCharacter(randomMahajaniCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑅶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMahajaniCharacterValueCount },
        (_, index) =>
          calculateRandomMahajaniCharacter(
            () => (index + 0.5) / randomMahajaniCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMahajaniCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMahajaniCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
