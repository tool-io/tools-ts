import { describe, expect, it } from "vitest";
import {
  calculateRandomElbasanLetter,
  randomElbasanLetterExample,
  randomElbasanLetterValueCount,
  runRandomElbasanLetter,
} from "./tool.js";

describe("Random Elbasan Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomElbasanLetter(randomElbasanLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𐔀" } });
    expect(
      runRandomElbasanLetter(randomElbasanLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𐔧" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomElbasanLetterValueCount },
        (_, index) =>
          calculateRandomElbasanLetter(
            () => (index + 0.5) / randomElbasanLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomElbasanLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomElbasanLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
