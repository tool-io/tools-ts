import { describe, expect, it } from "vitest";
import {
  calculateRandomPahawhHmongCharacter,
  randomPahawhHmongCharacterExample,
  randomPahawhHmongCharacterValueCount,
  runRandomPahawhHmongCharacter,
} from "./tool.js";

describe("Random Pahawh Hmong Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPahawhHmongCharacter(randomPahawhHmongCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖬀" } });
    expect(
      runRandomPahawhHmongCharacter(randomPahawhHmongCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖮏" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPahawhHmongCharacterValueCount },
        (_, index) =>
          calculateRandomPahawhHmongCharacter(
            () => (index + 0.5) / randomPahawhHmongCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPahawhHmongCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomPahawhHmongCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
