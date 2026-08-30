import { describe, expect, it } from "vitest";
import {
  calculateRandomUnicodePrivateUseCharacter,
  randomUnicodePrivateUseCharacterExample,
  randomUnicodePrivateUseCharacterValueCount,
  runRandomUnicodePrivateUseCharacter,
} from "./tool.js";

describe("Random Unicode Private-Use Character Generator", () => {
  it("executes the canonical example with injected boundary samples", () => {
    expect(JSON.parse(JSON.stringify(randomUnicodePrivateUseCharacterExample))).toEqual(randomUnicodePrivateUseCharacterExample);
    expect(runRandomUnicodePrivateUseCharacter(randomUnicodePrivateUseCharacterExample.input, { random: () => 0 })).toEqual({
      ok: true,
      output: { value: "" },
    });
    expect(runRandomUnicodePrivateUseCharacter(randomUnicodePrivateUseCharacterExample.input, { random: () => 1 - Number.EPSILON })).toEqual({
      ok: true,
      output: { value: "􏿽" },
    });
  });

  it("makes the declared repertoire reachable without weighting gaps", () => {
    expect(randomUnicodePrivateUseCharacterValueCount).toBe(137468);
    expect(calculateRandomUnicodePrivateUseCharacter(() => 0)?.value).toBe("");
    expect(calculateRandomUnicodePrivateUseCharacter(() => 1 - Number.EPSILON)?.value).toBe("􏿽");
  });

  it("rejects invalid random samples and unexpected input", () => {
    for (const sample of [-0.1, 1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(runRandomUnicodePrivateUseCharacter({}, { random: () => sample })).toMatchObject({
        error: { issues: [{ code: "invalid_random_source" }] },
        ok: false,
      });
    }
    expect(runRandomUnicodePrivateUseCharacter({ unexpected: true })).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "unexpected" }] },
      ok: false,
    });
  });
});
