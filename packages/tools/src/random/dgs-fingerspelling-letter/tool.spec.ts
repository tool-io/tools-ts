import { describe, expect, it } from "vitest";
import {
  calculateRandomDgsFingerspellingLetter,
  randomDgsFingerspellingLetterExample,
  randomDgsFingerspellingLetterValueCount,
  runRandomDgsFingerspellingLetter,
} from "./tool.js";

describe("Random DGS Fingerspelling Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDgsFingerspellingLetter(
        randomDgsFingerspellingLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "A" } });
    expect(
      runRandomDgsFingerspellingLetter(
        randomDgsFingerspellingLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "SCH" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDgsFingerspellingLetterValueCount },
        (_, index) =>
          calculateRandomDgsFingerspellingLetter(
            () => (index + 0.5) / randomDgsFingerspellingLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDgsFingerspellingLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomDgsFingerspellingLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
