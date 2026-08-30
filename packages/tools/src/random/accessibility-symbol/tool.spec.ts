import { describe, expect, it } from "vitest";
import {
  calculateRandomAccessibilitySymbol,
  randomAccessibilitySymbolExample,
  randomAccessibilitySymbolValueCount,
  runRandomAccessibilitySymbol,
} from "./tool.js";

describe("Random Accessibility Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAccessibilitySymbol(randomAccessibilitySymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "♿" } });
    expect(
      runRandomAccessibilitySymbol(randomAccessibilitySymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "🦿" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAccessibilitySymbolValueCount },
        (_, index) =>
          calculateRandomAccessibilitySymbol(
            () => (index + 0.5) / randomAccessibilitySymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAccessibilitySymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomAccessibilitySymbol({}, { random: () => 1 })).toMatchObject(
      { error: { issues: [{ code: "invalid_random_source" }] }, ok: false },
    );
  });
});
