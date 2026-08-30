import { describe, expect, it } from "vitest";
import {
  calculateRandomCyproMinoanSign,
  randomCyproMinoanSignExample,
  randomCyproMinoanSignValueCount,
  runRandomCyproMinoanSign,
} from "./tool.js";

describe("Random Cypro-Minoan Sign Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomCyproMinoanSign(randomCyproMinoanSignExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐄀" } });
    expect(
      runRandomCyproMinoanSign(randomCyproMinoanSignExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𒿲" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomCyproMinoanSignValueCount },
        (_, index) =>
          calculateRandomCyproMinoanSign(
            () => (index + 0.5) / randomCyproMinoanSignValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomCyproMinoanSignValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomCyproMinoanSign({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
