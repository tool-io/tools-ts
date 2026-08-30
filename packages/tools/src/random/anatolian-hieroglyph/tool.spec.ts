import { describe, expect, it } from "vitest";
import {
  calculateRandomAnatolianHieroglyph,
  randomAnatolianHieroglyphExample,
  randomAnatolianHieroglyphValueCount,
  runRandomAnatolianHieroglyph,
} from "./tool.js";

describe("Random Anatolian Hieroglyph Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAnatolianHieroglyph(randomAnatolianHieroglyphExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𔐀" } });
    expect(
      runRandomAnatolianHieroglyph(randomAnatolianHieroglyphExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𔙆" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAnatolianHieroglyphValueCount },
        (_, index) =>
          calculateRandomAnatolianHieroglyph(
            () => (index + 0.5) / randomAnatolianHieroglyphValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAnatolianHieroglyphValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAnatolianHieroglyph({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
