import { describe, expect, it } from "vitest";
import {
  calculateRandomCountingRodNumeral,
  randomCountingRodNumeralExample,
  randomCountingRodNumeralValueCount,
  runRandomCountingRodNumeral,
} from "./tool.js";

describe("Random Counting Rod Numeral Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCountingRodNumeral(randomCountingRodNumeralExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝍠" } });
    expect(
      runRandomCountingRodNumeral(randomCountingRodNumeralExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝍱" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCountingRodNumeralValueCount },
        (_, index) =>
          calculateRandomCountingRodNumeral(
            () => (index + 0.5) / randomCountingRodNumeralValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCountingRodNumeralValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCountingRodNumeral({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
