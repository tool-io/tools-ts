import { describe, expect, it } from "vitest";
import {
  calculateRandomAncientGreekNumeral,
  randomAncientGreekNumeralExample,
  randomAncientGreekNumeralValueCount,
  runRandomAncientGreekNumeral,
} from "./tool.js";

describe("Random Ancient Greek Numeral Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAncientGreekNumeral(randomAncientGreekNumeralExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐅀" } });
    expect(
      runRandomAncientGreekNumeral(randomAncientGreekNumeralExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐅴" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAncientGreekNumeralValueCount },
        (_, index) =>
          calculateRandomAncientGreekNumeral(
            () => (index + 0.5) / randomAncientGreekNumeralValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAncientGreekNumeralValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAncientGreekNumeral({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
