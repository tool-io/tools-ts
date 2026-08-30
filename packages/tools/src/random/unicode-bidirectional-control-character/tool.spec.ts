import { describe, expect, it } from "vitest";
import {
  calculateRandomUnicodeBidirectionalControlCharacter,
  randomUnicodeBidirectionalControlCharacterExample,
  randomUnicodeBidirectionalControlCharacterValueCount,
  runRandomUnicodeBidirectionalControlCharacter,
} from "./tool.js";

describe("Random Unicode Bidirectional Control Character Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomUnicodeBidirectionalControlCharacterExample))).toEqual(randomUnicodeBidirectionalControlCharacterExample);
    expect(runRandomUnicodeBidirectionalControlCharacter(randomUnicodeBidirectionalControlCharacterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "؜" },
    });
    expect(runRandomUnicodeBidirectionalControlCharacter(randomUnicodeBidirectionalControlCharacterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "⁩" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomUnicodeBidirectionalControlCharacterValueCount },
        (_, index) =>
          calculateRandomUnicodeBidirectionalControlCharacter(
            () => (index + 0.5) / randomUnicodeBidirectionalControlCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomUnicodeBidirectionalControlCharacterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomUnicodeBidirectionalControlCharacter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomUnicodeBidirectionalControlCharacter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
