import { describe, expect, it } from "vitest";
import {
  calculateRandomGurungKhemaCharacter,
  randomGurungKhemaCharacterExample,
  randomGurungKhemaCharacterValueCount,
  runRandomGurungKhemaCharacter,
} from "./tool.js";

describe("Random Gurung Khema Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGurungKhemaCharacter(randomGurungKhemaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॥" } });
    expect(
      runRandomGurungKhemaCharacter(randomGurungKhemaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖄹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGurungKhemaCharacterValueCount },
        (_, index) =>
          calculateRandomGurungKhemaCharacter(
            () => (index + 0.5) / randomGurungKhemaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGurungKhemaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomGurungKhemaCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
