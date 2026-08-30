import { describe, expect, it } from "vitest";
import {
  calculateRandomMedefaidrinLetter,
  randomMedefaidrinLetterExample,
  randomMedefaidrinLetterValueCount,
  runRandomMedefaidrinLetter,
} from "./tool.js";

describe("Random Medefaidrin Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMedefaidrinLetter(randomMedefaidrinLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𖹀" } });
    expect(
      runRandomMedefaidrinLetter(randomMedefaidrinLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𖹿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMedefaidrinLetterValueCount },
        (_, index) =>
          calculateRandomMedefaidrinLetter(
            () => (index + 0.5) / randomMedefaidrinLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMedefaidrinLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMedefaidrinLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
