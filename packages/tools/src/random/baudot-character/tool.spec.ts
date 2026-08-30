import { describe, expect, it } from "vitest";
import {
  calculateRandomBaudotCharacter,
  randomBaudotCharacterExample,
  randomBaudotCharacterValueCount,
  runRandomBaudotCharacter,
} from "./tool.js";

describe("Random Baudot Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBaudotCharacter(randomBaudotCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "00000 — NUL" } });
    expect(
      runRandomBaudotCharacter(randomBaudotCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "11111 — letters shift" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBaudotCharacterValueCount },
        (_, index) =>
          calculateRandomBaudotCharacter(
            () => (index + 0.5) / randomBaudotCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBaudotCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBaudotCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
