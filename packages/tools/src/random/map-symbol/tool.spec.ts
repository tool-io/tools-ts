import { describe, expect, it } from "vitest";
import {
  calculateRandomMapSymbol,
  randomMapSymbolExample,
  randomMapSymbolValueCount,
  runRandomMapSymbol,
} from "./tool.js";

describe("Random Map Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomMapSymbol(randomMapSymbolExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "⌖" } });
    expect(
      runRandomMapSymbol(randomMapSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "✈" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomMapSymbolValueCount },
        (_, index) =>
          calculateRandomMapSymbol(
            () => (index + 0.5) / randomMapSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomMapSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomMapSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
