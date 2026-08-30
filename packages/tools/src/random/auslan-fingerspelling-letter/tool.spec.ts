import { describe, expect, it } from "vitest";
import {
  calculateRandomAuslanFingerspellingLetter,
  randomAuslanFingerspellingLetterExample,
  randomAuslanFingerspellingLetterValueCount,
  runRandomAuslanFingerspellingLetter,
} from "./tool.js";

describe("Random Auslan Fingerspelling Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAuslanFingerspellingLetter(
        randomAuslanFingerspellingLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "A" } });
    expect(
      runRandomAuslanFingerspellingLetter(
        randomAuslanFingerspellingLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "Z" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAuslanFingerspellingLetterValueCount },
        (_, index) =>
          calculateRandomAuslanFingerspellingLetter(
            () => (index + 0.5) / randomAuslanFingerspellingLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAuslanFingerspellingLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomAuslanFingerspellingLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
