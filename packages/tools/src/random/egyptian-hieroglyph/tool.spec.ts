import { describe, expect, it } from "vitest";
import {
  calculateRandomEgyptianHieroglyph,
  randomEgyptianHieroglyphExample,
  randomEgyptianHieroglyphValueCount,
  runRandomEgyptianHieroglyph,
} from "./tool.js";

describe("Random Egyptian Hieroglyph Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomEgyptianHieroglyph(randomEgyptianHieroglyphExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𓀀" } });
    expect(
      runRandomEgyptianHieroglyph(randomEgyptianHieroglyphExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𔏺" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomEgyptianHieroglyphValueCount },
        (_, index) =>
          calculateRandomEgyptianHieroglyph(
            () => (index + 0.5) / randomEgyptianHieroglyphValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomEgyptianHieroglyphValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomEgyptianHieroglyph({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
