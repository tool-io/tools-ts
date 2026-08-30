import { describe, expect, it } from "vitest";
import {
  calculateRandomShavianLetter,
  randomShavianLetterExample,
  randomShavianLetterValueCount,
  runRandomShavianLetter,
} from "./tool.js";

describe("Random Shavian Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomShavianLetter(randomShavianLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐑐" } });
    expect(
      runRandomShavianLetter(randomShavianLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐑿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomShavianLetterValueCount },
        (_, index) =>
          calculateRandomShavianLetter(
            () => (index + 0.5) / randomShavianLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomShavianLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomShavianLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
