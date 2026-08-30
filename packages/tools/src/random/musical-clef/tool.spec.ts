import { describe, expect, it } from "vitest";
import {
  calculateRandomMusicalClef,
  randomMusicalClefExample,
  randomMusicalClefValueCount,
  runRandomMusicalClef,
} from "./tool.js";

describe("Random Musical Clef Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMusicalClef(randomMusicalClefExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𝄞" } });
    expect(
      runRandomMusicalClef(randomMusicalClefExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝉾" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMusicalClefValueCount },
        (_, index) =>
          calculateRandomMusicalClef(
            () => (index + 0.5) / randomMusicalClefValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMusicalClefValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMusicalClef({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
