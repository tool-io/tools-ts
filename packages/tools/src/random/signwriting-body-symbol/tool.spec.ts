import { describe, expect, it } from "vitest";
import {
  calculateRandomSignwritingBodySymbol,
  randomSignwritingBodySymbolExample,
  randomSignwritingBodySymbolValueCount,
  runRandomSignwritingBodySymbol,
} from "./tool.js";

describe("Random SignWriting Body Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSignwritingBodySymbol(randomSignwritingBodySymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝩭" } });
    expect(
      runRandomSignwritingBodySymbol(randomSignwritingBodySymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝩽" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSignwritingBodySymbolValueCount },
        (_, index) =>
          calculateRandomSignwritingBodySymbol(
            () => (index + 0.5) / randomSignwritingBodySymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSignwritingBodySymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSignwritingBodySymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
