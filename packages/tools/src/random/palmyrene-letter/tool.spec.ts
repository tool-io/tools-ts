import { describe, expect, it } from "vitest";
import {
  calculateRandomPalmyreneLetter,
  randomPalmyreneLetterExample,
  randomPalmyreneLetterValueCount,
  runRandomPalmyreneLetter,
} from "./tool.js";

describe("Random Palmyrene Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPalmyreneLetter(randomPalmyreneLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐡠" } });
    expect(
      runRandomPalmyreneLetter(randomPalmyreneLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐡶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPalmyreneLetterValueCount },
        (_, index) =>
          calculateRandomPalmyreneLetter(
            () => (index + 0.5) / randomPalmyreneLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPalmyreneLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomPalmyreneLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
