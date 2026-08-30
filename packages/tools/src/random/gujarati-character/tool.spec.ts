import { describe, expect, it } from "vitest";
import {
  calculateRandomGujaratiCharacter,
  randomGujaratiCharacterExample,
  randomGujaratiCharacterValueCount,
  runRandomGujaratiCharacter,
} from "./tool.js";

describe("Random Gujarati Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomGujaratiCharacter(randomGujaratiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "॑" } });
    expect(
      runRandomGujaratiCharacter(randomGujaratiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "꠹" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomGujaratiCharacterValueCount },
        (_, index) =>
          calculateRandomGujaratiCharacter(
            () => (index + 0.5) / randomGujaratiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomGujaratiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomGujaratiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
