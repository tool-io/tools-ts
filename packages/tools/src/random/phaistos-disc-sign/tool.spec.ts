import { describe, expect, it } from "vitest";
import {
  calculateRandomPhaistosDiscSign,
  randomPhaistosDiscSignExample,
  randomPhaistosDiscSignValueCount,
  runRandomPhaistosDiscSign,
} from "./tool.js";

describe("Random Phaistos Disc Sign Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomPhaistosDiscSign(randomPhaistosDiscSignExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐇐" } });
    expect(
      runRandomPhaistosDiscSign(randomPhaistosDiscSignExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐇽" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomPhaistosDiscSignValueCount },
        (_, index) =>
          calculateRandomPhaistosDiscSign(
            () => (index + 0.5) / randomPhaistosDiscSignValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomPhaistosDiscSignValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomPhaistosDiscSign({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
