import { describe, expect, it } from "vitest";
import {
  calculateRandomManichaeanCharacter,
  randomManichaeanCharacterExample,
  randomManichaeanCharacterValueCount,
  runRandomManichaeanCharacter,
} from "./tool.js";

describe("Random Manichaean Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomManichaeanCharacter(randomManichaeanCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomManichaeanCharacter(randomManichaeanCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐫶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomManichaeanCharacterValueCount },
        (_, index) =>
          calculateRandomManichaeanCharacter(
            () => (index + 0.5) / randomManichaeanCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomManichaeanCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomManichaeanCharacter({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
