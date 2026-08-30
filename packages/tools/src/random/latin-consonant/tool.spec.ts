import { describe, expect, it } from "vitest";
import {
  calculateRandomLatinConsonant,
  randomLatinConsonantExample,
  randomLatinConsonantValueCount,
  runRandomLatinConsonant,
} from "./tool.js";

describe("Random Latin Consonant Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomLatinConsonantExample))).toEqual(randomLatinConsonantExample);
    expect(runRandomLatinConsonant(randomLatinConsonantExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "B" },
    });
    expect(runRandomLatinConsonant(randomLatinConsonantExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "z" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    const selected = new Set(
      Array.from(
        { length: randomLatinConsonantValueCount },
        (_, index) =>
          calculateRandomLatinConsonant(
            () => (index + 0.5) / randomLatinConsonantValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLatinConsonantValueCount);
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomLatinConsonant({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomLatinConsonant({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
