import { describe, expect, it } from "vitest";
import {
  calculateRandomInternationalSemaphoreLetter,
  randomInternationalSemaphoreLetterExample,
  randomInternationalSemaphoreLetterValueCount,
  runRandomInternationalSemaphoreLetter,
} from "./tool.js";

describe("Random International Semaphore Letter Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomInternationalSemaphoreLetter(
        randomInternationalSemaphoreLetterExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "A" } });
    expect(
      runRandomInternationalSemaphoreLetter(
        randomInternationalSemaphoreLetterExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "Z" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomInternationalSemaphoreLetterValueCount },
        (_, index) =>
          calculateRandomInternationalSemaphoreLetter(
            () => (index + 0.5) / randomInternationalSemaphoreLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomInternationalSemaphoreLetterValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomInternationalSemaphoreLetter({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
