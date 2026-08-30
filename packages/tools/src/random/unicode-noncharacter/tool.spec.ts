import { describe, expect, it } from "vitest";
import {
  calculateRandomUnicodeNoncharacter,
  randomUnicodeNoncharacterExample,
  randomUnicodeNoncharacterValueCount,
  runRandomUnicodeNoncharacter,
} from "./tool.js";

describe("Random Unicode Noncharacter Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomUnicodeNoncharacterExample))).toEqual(randomUnicodeNoncharacterExample);
    expect(runRandomUnicodeNoncharacter(randomUnicodeNoncharacterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "﷐" },
    });
    expect(runRandomUnicodeNoncharacter(randomUnicodeNoncharacterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "􏿿" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomUnicodeNoncharacterValueCount },
        (_, index) =>
          calculateRandomUnicodeNoncharacter(
            () => (index + 0.5) / randomUnicodeNoncharacterValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomUnicodeNoncharacterValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomUnicodeNoncharacter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomUnicodeNoncharacter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
