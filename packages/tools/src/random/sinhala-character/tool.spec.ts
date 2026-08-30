import { describe, expect, it } from "vitest";
import {
  calculateRandomSinhalaCharacter,
  randomSinhalaCharacterExample,
  randomSinhalaCharacterValueCount,
  runRandomSinhalaCharacter,
} from "./tool.js";

describe("Random Sinhala Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSinhalaCharacter(randomSinhalaCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "।" } });
    expect(
      runRandomSinhalaCharacter(randomSinhalaCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑇴" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSinhalaCharacterValueCount },
        (_, index) =>
          calculateRandomSinhalaCharacter(
            () => (index + 0.5) / randomSinhalaCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSinhalaCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomSinhalaCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
