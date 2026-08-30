import { describe, expect, it } from "vitest";
import {
  calculateRandomFrakturLetter,
  randomFrakturLetterExample,
  randomFrakturLetterValueCount,
  runRandomFrakturLetter,
} from "./tool.js";

describe("Random Fraktur Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomFrakturLetterExample))).toEqual(randomFrakturLetterExample);
    expect(runRandomFrakturLetter(randomFrakturLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "𝔄" },
    });
    expect(runRandomFrakturLetter(randomFrakturLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "𝔷" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomFrakturLetterValueCount },
        (_, index) =>
          calculateRandomFrakturLetter(
            () => (index + 0.5) / randomFrakturLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomFrakturLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomFrakturLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomFrakturLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
