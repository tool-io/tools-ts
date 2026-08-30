import { describe, expect, it } from "vitest";
import {
  calculateRandomAsciiControlCharacter,
  randomAsciiControlCharacterExample,
  randomAsciiControlCharacterValueCount,
  runRandomAsciiControlCharacter,
} from "./tool.js";

describe("Random ASCII Control Character Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomAsciiControlCharacterExample))).toEqual(randomAsciiControlCharacterExample);
    expect(runRandomAsciiControlCharacter(randomAsciiControlCharacterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "\u0000" },
    });
    expect(runRandomAsciiControlCharacter(randomAsciiControlCharacterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomAsciiControlCharacterValueCount },
        (_, index) =>
          calculateRandomAsciiControlCharacter(
            () => (index + 0.5) / randomAsciiControlCharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAsciiControlCharacterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomAsciiControlCharacter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomAsciiControlCharacter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
