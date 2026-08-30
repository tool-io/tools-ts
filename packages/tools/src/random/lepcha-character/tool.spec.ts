import { describe, expect, it } from "vitest";
import {
  calculateRandomLepchaCharacter,
  randomLepchaCharacterExample,
  randomLepchaCharacterValueCount,
  runRandomLepchaCharacter,
} from "./tool.js";

describe("Random Lepcha Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLepchaCharacter(randomLepchaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ᰀ" } });
    expect(
      runRandomLepchaCharacter(randomLepchaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᱏ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLepchaCharacterValueCount },
        (_, index) =>
          calculateRandomLepchaCharacter(
            () => (index + 0.5) / randomLepchaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLepchaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLepchaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
