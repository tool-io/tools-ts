import { describe, expect, it } from "vitest";
import {
  calculateRandomLsfFingerspellingLetter,
  randomLsfFingerspellingLetterExample,
  randomLsfFingerspellingLetterValueCount,
  runRandomLsfFingerspellingLetter,
} from "./tool.js";

describe("Random LSF Fingerspelling Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLsfFingerspellingLetter(
        randomLsfFingerspellingLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "A" } });
    expect(
      runRandomLsfFingerspellingLetter(
        randomLsfFingerspellingLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "Z" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLsfFingerspellingLetterValueCount },
        (_, index) =>
          calculateRandomLsfFingerspellingLetter(
            () => (index + 0.5) / randomLsfFingerspellingLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLsfFingerspellingLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomLsfFingerspellingLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
