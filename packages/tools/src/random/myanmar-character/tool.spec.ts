import { describe, expect, it } from "vitest";
import {
  calculateRandomMyanmarCharacter,
  randomMyanmarCharacterExample,
  randomMyanmarCharacterValueCount,
  runRandomMyanmarCharacter,
} from "./tool.js";

describe("Random Myanmar Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMyanmarCharacter(randomMyanmarCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "က" } });
    expect(
      runRandomMyanmarCharacter(randomMyanmarCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑛣" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMyanmarCharacterValueCount },
        (_, index) =>
          calculateRandomMyanmarCharacter(
            () => (index + 0.5) / randomMyanmarCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMyanmarCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMyanmarCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
