import { describe, expect, it } from "vitest";
import {
  calculateRandomAslFingerspellingLetter,
  randomAslFingerspellingLetterExample,
  randomAslFingerspellingLetterValueCount,
  runRandomAslFingerspellingLetter,
} from "./tool.js";

describe("Random ASL Fingerspelling Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAslFingerspellingLetter(
        randomAslFingerspellingLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "A" } });
    expect(
      runRandomAslFingerspellingLetter(
        randomAslFingerspellingLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "Z" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAslFingerspellingLetterValueCount },
        (_, index) =>
          calculateRandomAslFingerspellingLetter(
            () => (index + 0.5) / randomAslFingerspellingLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAslFingerspellingLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomAslFingerspellingLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
