import { describe, expect, it } from "vitest";
import {
  calculateRandomLinearBSign,
  randomLinearBSignExample,
  randomLinearBSignValueCount,
  runRandomLinearBSign,
} from "./tool.js";

describe("Random Linear B Sign Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLinearBSign(randomLinearBSignExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𐀀" } });
    expect(
      runRandomLinearBSign(randomLinearBSignExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐄿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLinearBSignValueCount },
        (_, index) =>
          calculateRandomLinearBSign(
            () => (index + 0.5) / randomLinearBSignValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLinearBSignValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLinearBSign({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
