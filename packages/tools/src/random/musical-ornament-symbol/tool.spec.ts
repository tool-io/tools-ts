import { describe, expect, it } from "vitest";
import {
  calculateRandomMusicalOrnamentSymbol,
  randomMusicalOrnamentSymbolExample,
  randomMusicalOrnamentSymbolValueCount,
  runRandomMusicalOrnamentSymbol,
} from "./tool.js";

describe("Random Musical Ornament Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMusicalOrnamentSymbol(randomMusicalOrnamentSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝆖" } });
    expect(
      runRandomMusicalOrnamentSymbol(randomMusicalOrnamentSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝆥" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMusicalOrnamentSymbolValueCount },
        (_, index) =>
          calculateRandomMusicalOrnamentSymbol(
            () => (index + 0.5) / randomMusicalOrnamentSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMusicalOrnamentSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomMusicalOrnamentSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
