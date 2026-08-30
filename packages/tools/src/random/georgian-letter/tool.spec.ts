import { describe, expect, it } from "vitest";
import {
  calculateRandomGeorgianLetter,
  randomGeorgianLetterExample,
  randomGeorgianLetterValueCount,
  runRandomGeorgianLetter,
} from "./tool.js";

describe("Random Georgian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGeorgianLetter(randomGeorgianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "Ⴀ" } });
    expect(
      runRandomGeorgianLetter(randomGeorgianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ⴭ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGeorgianLetterValueCount },
        (_, index) =>
          calculateRandomGeorgianLetter(
            () => (index + 0.5) / randomGeorgianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGeorgianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGeorgianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
