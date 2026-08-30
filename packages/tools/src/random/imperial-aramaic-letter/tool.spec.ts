import { describe, expect, it } from "vitest";
import {
  calculateRandomImperialAramaicLetter,
  randomImperialAramaicLetterExample,
  randomImperialAramaicLetterValueCount,
  runRandomImperialAramaicLetter,
} from "./tool.js";

describe("Random Imperial Aramaic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomImperialAramaicLetter(randomImperialAramaicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐡀" } });
    expect(
      runRandomImperialAramaicLetter(randomImperialAramaicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐡕" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomImperialAramaicLetterValueCount },
        (_, index) =>
          calculateRandomImperialAramaicLetter(
            () => (index + 0.5) / randomImperialAramaicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomImperialAramaicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomImperialAramaicLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
