import { describe, expect, it } from "vitest";
import {
  calculateRandomWanchoLetter,
  randomWanchoLetterExample,
  randomWanchoLetterValueCount,
  runRandomWanchoLetter,
} from "./tool.js";

describe("Random Wancho Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomWanchoLetter(randomWanchoLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𞋀" } });
    expect(
      runRandomWanchoLetter(randomWanchoLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𞋫" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomWanchoLetterValueCount },
        (_, index) =>
          calculateRandomWanchoLetter(
            () => (index + 0.5) / randomWanchoLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomWanchoLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomWanchoLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
