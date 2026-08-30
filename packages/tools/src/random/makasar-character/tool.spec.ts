import { describe, expect, it } from "vitest";
import {
  calculateRandomMakasarCharacter,
  randomMakasarCharacterExample,
  randomMakasarCharacterValueCount,
  runRandomMakasarCharacter,
} from "./tool.js";

describe("Random Makasar Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMakasarCharacter(randomMakasarCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𑻠" } });
    expect(
      runRandomMakasarCharacter(randomMakasarCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𑻸" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMakasarCharacterValueCount },
        (_, index) =>
          calculateRandomMakasarCharacter(
            () => (index + 0.5) / randomMakasarCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMakasarCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMakasarCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
