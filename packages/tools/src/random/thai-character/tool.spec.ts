import { describe, expect, it } from "vitest";
import {
  calculateRandomThaiCharacter,
  randomThaiCharacterExample,
  randomThaiCharacterValueCount,
  runRandomThaiCharacter,
} from "./tool.js";

describe("Random Thai Character Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomThaiCharacter(randomThaiCharacterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ʼ" } });
    expect(
      runRandomThaiCharacter(randomThaiCharacterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "๛" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomThaiCharacterValueCount },
        (_, index) =>
          calculateRandomThaiCharacter(
            () => (index + 0.5) / randomThaiCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomThaiCharacterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomThaiCharacter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
