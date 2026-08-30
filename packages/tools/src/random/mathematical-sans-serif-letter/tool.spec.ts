import { describe, expect, it } from "vitest";
import {
  calculateRandomMathematicalSansSerifLetter,
  randomMathematicalSansSerifLetterExample,
  randomMathematicalSansSerifLetterValueCount,
  runRandomMathematicalSansSerifLetter,
} from "./tool.js";

describe("Random Mathematical Sans-Serif Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomMathematicalSansSerifLetterExample))).toEqual(randomMathematicalSansSerifLetterExample);
    expect(runRandomMathematicalSansSerifLetter(randomMathematicalSansSerifLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "𝖠" },
    });
    expect(runRandomMathematicalSansSerifLetter(randomMathematicalSansSerifLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "𝙯" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomMathematicalSansSerifLetterValueCount },
        (_, index) =>
          calculateRandomMathematicalSansSerifLetter(
            () => (index + 0.5) / randomMathematicalSansSerifLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMathematicalSansSerifLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomMathematicalSansSerifLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomMathematicalSansSerifLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
