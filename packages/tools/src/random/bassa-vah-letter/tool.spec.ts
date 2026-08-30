import { describe, expect, it } from "vitest";
import {
  calculateRandomBassaVahLetter,
  randomBassaVahLetterExample,
  randomBassaVahLetterValueCount,
  runRandomBassaVahLetter,
} from "./tool.js";

describe("Random Bassa Vah Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBassaVahLetter(randomBassaVahLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖫐" } });
    expect(
      runRandomBassaVahLetter(randomBassaVahLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖫭" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBassaVahLetterValueCount },
        (_, index) =>
          calculateRandomBassaVahLetter(
            () => (index + 0.5) / randomBassaVahLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBassaVahLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBassaVahLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
