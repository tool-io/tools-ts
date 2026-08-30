import { describe, expect, it } from "vitest";
import {
  calculateRandomMusicalAccidental,
  randomMusicalAccidentalExample,
  randomMusicalAccidentalValueCount,
  runRandomMusicalAccidental,
} from "./tool.js";

describe("Random Musical Accidental Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMusicalAccidental(randomMusicalAccidentalExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "♭" } });
    expect(
      runRandomMusicalAccidental(randomMusicalAccidentalExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝉠" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMusicalAccidentalValueCount },
        (_, index) =>
          calculateRandomMusicalAccidental(
            () => (index + 0.5) / randomMusicalAccidentalValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMusicalAccidentalValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMusicalAccidental({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
