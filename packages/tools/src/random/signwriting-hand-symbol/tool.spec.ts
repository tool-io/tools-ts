import { describe, expect, it } from "vitest";
import {
  calculateRandomSignwritingHandSymbol,
  randomSignwritingHandSymbolExample,
  randomSignwritingHandSymbolValueCount,
  runRandomSignwritingHandSymbol,
} from "./tool.js";

describe("Random SignWriting Hand Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSignwritingHandSymbol(randomSignwritingHandSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝠀" } });
    expect(
      runRandomSignwritingHandSymbol(randomSignwritingHandSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝤄" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSignwritingHandSymbolValueCount },
        (_, index) =>
          calculateRandomSignwritingHandSymbol(
            () => (index + 0.5) / randomSignwritingHandSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSignwritingHandSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSignwritingHandSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
