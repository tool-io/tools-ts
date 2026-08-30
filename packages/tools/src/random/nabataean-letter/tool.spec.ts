import { describe, expect, it } from "vitest";
import {
  calculateRandomNabataeanLetter,
  randomNabataeanLetterExample,
  randomNabataeanLetterValueCount,
  runRandomNabataeanLetter,
} from "./tool.js";

describe("Random Nabataean Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNabataeanLetter(randomNabataeanLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐢀" } });
    expect(
      runRandomNabataeanLetter(randomNabataeanLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐢞" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNabataeanLetterValueCount },
        (_, index) =>
          calculateRandomNabataeanLetter(
            () => (index + 0.5) / randomNabataeanLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNabataeanLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomNabataeanLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
