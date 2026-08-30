import { describe, expect, it } from "vitest";
import {
  calculateRandomMayanNumeral,
  randomMayanNumeralExample,
  randomMayanNumeralValueCount,
  runRandomMayanNumeral,
} from "./tool.js";

describe("Random Mayan Numeral Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMayanNumeral(randomMayanNumeralExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝋠" } });
    expect(
      runRandomMayanNumeral(randomMayanNumeralExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝋳" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMayanNumeralValueCount },
        (_, index) =>
          calculateRandomMayanNumeral(
            () => (index + 0.5) / randomMayanNumeralValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMayanNumeralValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMayanNumeral({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
