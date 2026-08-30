import { describe, expect, it } from "vitest";
import {
  calculateRandomIChingTrigram,
  randomIChingTrigramExample,
  randomIChingTrigramValueCount,
  runRandomIChingTrigram,
} from "./tool.js";

describe("Random I Ching Trigram Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomIChingTrigram(randomIChingTrigramExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "☰" } });
    expect(
      runRandomIChingTrigram(randomIChingTrigramExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "☷" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomIChingTrigramValueCount },
        (_, index) =>
          calculateRandomIChingTrigram(
            () => (index + 0.5) / randomIChingTrigramValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomIChingTrigramValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomIChingTrigram({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
