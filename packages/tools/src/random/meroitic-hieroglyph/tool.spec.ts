import { describe, expect, it } from "vitest";
import {
  calculateRandomMeroiticHieroglyph,
  randomMeroiticHieroglyphExample,
  randomMeroiticHieroglyphValueCount,
  runRandomMeroiticHieroglyph,
} from "./tool.js";

describe("Random Meroitic Hieroglyph Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMeroiticHieroglyph(randomMeroiticHieroglyphExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐦀" } });
    expect(
      runRandomMeroiticHieroglyph(randomMeroiticHieroglyphExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐦟" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMeroiticHieroglyphValueCount },
        (_, index) =>
          calculateRandomMeroiticHieroglyph(
            () => (index + 0.5) / randomMeroiticHieroglyphValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMeroiticHieroglyphValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMeroiticHieroglyph({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
