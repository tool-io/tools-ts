import { describe, expect, it } from "vitest";
import {
  calculateRandomMendeKikakuiCharacter,
  randomMendeKikakuiCharacterExample,
  randomMendeKikakuiCharacterValueCount,
  runRandomMendeKikakuiCharacter,
} from "./tool.js";

describe("Random Mende Kikakui Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMendeKikakuiCharacter(randomMendeKikakuiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𞠀" } });
    expect(
      runRandomMendeKikakuiCharacter(randomMendeKikakuiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞣖" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMendeKikakuiCharacterValueCount },
        (_, index) =>
          calculateRandomMendeKikakuiCharacter(
            () => (index + 0.5) / randomMendeKikakuiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMendeKikakuiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomMendeKikakuiCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
