import { describe, expect, it } from "vitest";
import {
  calculateRandomTaiXuanJingSymbol,
  randomTaiXuanJingSymbolExample,
  randomTaiXuanJingSymbolValueCount,
  runRandomTaiXuanJingSymbol,
} from "./tool.js";

describe("Random Tai Xuan Jing Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomTaiXuanJingSymbol(randomTaiXuanJingSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "𝌀" } });
    expect(
      runRandomTaiXuanJingSymbol(randomTaiXuanJingSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "𝍖" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomTaiXuanJingSymbolValueCount },
        (_, index) =>
          calculateRandomTaiXuanJingSymbol(
            () => (index + 0.5) / randomTaiXuanJingSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomTaiXuanJingSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomTaiXuanJingSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
