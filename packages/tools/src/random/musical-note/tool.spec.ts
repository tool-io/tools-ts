import { describe, expect, it } from "vitest";
import {
  calculateRandomMusicalNote,
  randomMusicalNoteExample,
  randomMusicalNoteValueCount,
  runRandomMusicalNote,
} from "./tool.js";

describe("Random Musical Note Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMusicalNote(randomMusicalNoteExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "𝅃" } });
    expect(
      runRandomMusicalNote(randomMusicalNoteExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🎶" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMusicalNoteValueCount },
        (_, index) =>
          calculateRandomMusicalNote(
            () => (index + 0.5) / randomMusicalNoteValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMusicalNoteValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMusicalNote({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
