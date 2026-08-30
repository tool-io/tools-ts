import { describe, expect, it } from "vitest";
import {
  calculateRandomJawiLetter,
  randomJawiLetterExample,
  randomJawiLetterValueCount,
  runRandomJawiLetter,
} from "./tool.js";

describe("Random Jawi Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomJawiLetterExample))).toEqual(randomJawiLetterExample);
    expect(runRandomJawiLetter(randomJawiLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomJawiLetter(randomJawiLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ڽ" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomJawiLetterValueCount },
        (_, index) =>
          calculateRandomJawiLetter(
            () => (index + 0.5) / randomJawiLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomJawiLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomJawiLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomJawiLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
