import { describe, expect, it } from "vitest";
import {
  calculateRandomOldPermicLetter,
  randomOldPermicLetterExample,
  randomOldPermicLetterValueCount,
  runRandomOldPermicLetter,
} from "./tool.js";

describe("Random Old Permic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomOldPermicLetter(randomOldPermicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐍐" } });
    expect(
      runRandomOldPermicLetter(randomOldPermicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐍵" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomOldPermicLetterValueCount },
        (_, index) =>
          calculateRandomOldPermicLetter(
            () => (index + 0.5) / randomOldPermicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomOldPermicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomOldPermicLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
