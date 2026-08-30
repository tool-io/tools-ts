import { describe, expect, it } from "vitest";
import {
  calculateRandomSignwritingLocationPunctuationSymbol,
  randomSignwritingLocationPunctuationSymbolExample,
  randomSignwritingLocationPunctuationSymbolValueCount,
  runRandomSignwritingLocationPunctuationSymbol,
} from "./tool.js";

describe("Random SignWriting Location and Punctuation Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSignwritingLocationPunctuationSymbol(
        randomSignwritingLocationPunctuationSymbolExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𝩿" } });
    expect(
      runRandomSignwritingLocationPunctuationSymbol(
        randomSignwritingLocationPunctuationSymbolExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𝪆" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSignwritingLocationPunctuationSymbolValueCount },
        (_, index) =>
          calculateRandomSignwritingLocationPunctuationSymbol(
            () =>
              (index + 0.5) /
              randomSignwritingLocationPunctuationSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(
      randomSignwritingLocationPunctuationSymbolValueCount,
    );
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSignwritingLocationPunctuationSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
