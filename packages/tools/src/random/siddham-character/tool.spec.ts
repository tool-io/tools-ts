import { describe, expect, it } from "vitest";
import {
  calculateRandomSiddhamCharacter,
  randomSiddhamCharacterExample,
  randomSiddhamCharacterValueCount,
  runRandomSiddhamCharacter,
} from "./tool.js";

describe("Random Siddham Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSiddhamCharacter(randomSiddhamCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑖀" } });
    expect(
      runRandomSiddhamCharacter(randomSiddhamCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑗝" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSiddhamCharacterValueCount },
        (_, index) =>
          calculateRandomSiddhamCharacter(
            () => (index + 0.5) / randomSiddhamCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSiddhamCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSiddhamCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
