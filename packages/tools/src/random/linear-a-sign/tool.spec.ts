import { describe, expect, it } from "vitest";
import {
  calculateRandomLinearASign,
  randomLinearASignExample,
  randomLinearASignValueCount,
  runRandomLinearASign,
} from "./tool.js";

describe("Random Linear A Sign Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLinearASign(randomLinearASignExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𐄇" } });
    expect(
      runRandomLinearASign(randomLinearASignExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐝧" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLinearASignValueCount },
        (_, index) =>
          calculateRandomLinearASign(
            () => (index + 0.5) / randomLinearASignValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLinearASignValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLinearASign({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
