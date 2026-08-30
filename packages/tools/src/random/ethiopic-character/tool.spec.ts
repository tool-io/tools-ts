import { describe, expect, it } from "vitest";
import {
  calculateRandomEthiopicCharacter,
  randomEthiopicCharacterExample,
  randomEthiopicCharacterValueCount,
  runRandomEthiopicCharacter,
} from "./tool.js";

describe("Random Ethiopic Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomEthiopicCharacter(randomEthiopicCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "̎" } });
    expect(
      runRandomEthiopicCharacter(randomEthiopicCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞟾" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomEthiopicCharacterValueCount },
        (_, index) =>
          calculateRandomEthiopicCharacter(
            () => (index + 0.5) / randomEthiopicCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomEthiopicCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomEthiopicCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
