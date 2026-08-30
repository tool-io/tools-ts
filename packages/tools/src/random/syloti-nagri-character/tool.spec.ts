import { describe, expect, it } from "vitest";
import {
  calculateRandomSylotiNagriCharacter,
  randomSylotiNagriCharacterExample,
  randomSylotiNagriCharacterValueCount,
  runRandomSylotiNagriCharacter,
} from "./tool.js";

describe("Random Syloti Nagri Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSylotiNagriCharacter(randomSylotiNagriCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomSylotiNagriCharacter(randomSylotiNagriCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꠬" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSylotiNagriCharacterValueCount },
        (_, index) =>
          calculateRandomSylotiNagriCharacter(
            () => (index + 0.5) / randomSylotiNagriCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSylotiNagriCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSylotiNagriCharacter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
