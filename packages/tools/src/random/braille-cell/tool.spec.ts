import { describe, expect, it } from "vitest";
import {
  calculateRandomBrailleCell,
  randomBrailleCellExample,
  randomBrailleCellValueCount,
  runRandomBrailleCell,
} from "./tool.js";

describe("Random Braille Cell Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomBrailleCell(randomBrailleCellExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "⠀" } });
    expect(
      runRandomBrailleCell(randomBrailleCellExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "⣿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomBrailleCellValueCount },
        (_, index) =>
          calculateRandomBrailleCell(
            () => (index + 0.5) / randomBrailleCellValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomBrailleCellValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomBrailleCell({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
