import { describe, expect, it } from "vitest";
import {
  calculateRandomDiceFace,
  randomDiceFaceExample,
  randomDiceFaceValueCount,
  runRandomDiceFace,
} from "./tool.js";

describe("Random Dice Face Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomDiceFace(randomDiceFaceExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "⚀" } });
    expect(
      runRandomDiceFace(randomDiceFaceExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "⚅" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomDiceFaceValueCount },
        (_, index) =>
          calculateRandomDiceFace(
            () => (index + 0.5) / randomDiceFaceValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDiceFaceValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomDiceFace({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
