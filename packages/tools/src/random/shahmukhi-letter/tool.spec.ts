import { describe, expect, it } from "vitest";
import {
  calculateRandomShahmukhiLetter,
  randomShahmukhiLetterExample,
  randomShahmukhiLetterValueCount,
  runRandomShahmukhiLetter,
} from "./tool.js";

describe("Random Shahmukhi Letter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomShahmukhiLetterExample))).toEqual(randomShahmukhiLetterExample);
    expect(runRandomShahmukhiLetter(randomShahmukhiLetterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "ا" },
    });
    expect(runRandomShahmukhiLetter(randomShahmukhiLetterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "ے" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomShahmukhiLetterValueCount },
        (_, index) =>
          calculateRandomShahmukhiLetter(
            () => (index + 0.5) / randomShahmukhiLetterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomShahmukhiLetterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomShahmukhiLetter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomShahmukhiLetter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
