import { describe, expect, it } from "vitest";
import {
  calculateRandomMandaicLetter,
  randomMandaicLetterExample,
  randomMandaicLetterValueCount,
  runRandomMandaicLetter,
} from "./tool.js";

describe("Random Mandaic Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMandaicLetter(randomMandaicLetterExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "ـ" } });
    expect(
      runRandomMandaicLetter(randomMandaicLetterExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ࡘ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMandaicLetterValueCount },
        (_, index) =>
          calculateRandomMandaicLetter(
            () => (index + 0.5) / randomMandaicLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMandaicLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMandaicLetter({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
