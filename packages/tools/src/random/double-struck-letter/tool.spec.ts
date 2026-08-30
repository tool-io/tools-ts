import { describe, expect, it } from "vitest";
import {
  calculateRandomDoubleStruckLetter,
  randomDoubleStruckLetterExample,
  randomDoubleStruckLetterValueCount,
  runRandomDoubleStruckLetter,
} from "./tool.js";

describe("Random Double-Struck Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomDoubleStruckLetterExample))).toEqual(randomDoubleStruckLetterExample);
    expect(runRandomDoubleStruckLetter(randomDoubleStruckLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "𝔸" },
    });
    expect(runRandomDoubleStruckLetter(randomDoubleStruckLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "𝕫" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomDoubleStruckLetterValueCount },
        (_, index) =>
          calculateRandomDoubleStruckLetter(
            () => (index + 0.5) / randomDoubleStruckLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomDoubleStruckLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomDoubleStruckLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomDoubleStruckLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
