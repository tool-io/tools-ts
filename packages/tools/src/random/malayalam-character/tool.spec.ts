import { describe, expect, it } from "vitest";
import {
  calculateRandomMalayalamCharacter,
  randomMalayalamCharacterExample,
  randomMalayalamCharacterValueCount,
  runRandomMalayalamCharacter,
} from "./tool.js";

describe("Random Malayalam Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMalayalamCharacter(randomMalayalamCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomMalayalamCharacter(randomMalayalamCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꠲" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMalayalamCharacterValueCount },
        (_, index) =>
          calculateRandomMalayalamCharacter(
            () => (index + 0.5) / randomMalayalamCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMalayalamCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMalayalamCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
