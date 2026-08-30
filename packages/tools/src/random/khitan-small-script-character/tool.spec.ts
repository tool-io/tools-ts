import { describe, expect, it } from "vitest";
import {
  calculateRandomKhitanSmallScriptCharacter,
  randomKhitanSmallScriptCharacterExample,
  randomKhitanSmallScriptCharacterValueCount,
  runRandomKhitanSmallScriptCharacter,
} from "./tool.js";

describe("Random Khitan Small Script Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomKhitanSmallScriptCharacter(
        randomKhitanSmallScriptCharacterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𖿤" } });
    expect(
      runRandomKhitanSmallScriptCharacter(
        randomKhitanSmallScriptCharacterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𘳿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomKhitanSmallScriptCharacterValueCount },
        (_, index) =>
          calculateRandomKhitanSmallScriptCharacter(
            () => (index + 0.5) / randomKhitanSmallScriptCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomKhitanSmallScriptCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomKhitanSmallScriptCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
