import { describe, expect, it } from "vitest";
import {
  calculateRandomNkoCharacter,
  randomNkoCharacterExample,
  randomNkoCharacterValueCount,
  runRandomNkoCharacter,
} from "./tool.js";

describe("Random NKo Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomNkoCharacter(randomNkoCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "،" } });
    expect(
      runRandomNkoCharacter(randomNkoCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "﴿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomNkoCharacterValueCount },
        (_, index) =>
          calculateRandomNkoCharacter(
            () => (index + 0.5) / randomNkoCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomNkoCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomNkoCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
