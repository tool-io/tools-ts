import { describe, expect, it } from "vitest";
import {
  calculateRandomBslFingerspellingLetter,
  randomBslFingerspellingLetterExample,
  randomBslFingerspellingLetterValueCount,
  runRandomBslFingerspellingLetter,
} from "./tool.js";

describe("Random BSL Fingerspelling Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBslFingerspellingLetter(
        randomBslFingerspellingLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "A" } });
    expect(
      runRandomBslFingerspellingLetter(
        randomBslFingerspellingLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "Z" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBslFingerspellingLetterValueCount },
        (_, index) =>
          calculateRandomBslFingerspellingLetter(
            () => (index + 0.5) / randomBslFingerspellingLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBslFingerspellingLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomBslFingerspellingLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
