import { describe, expect, it } from "vitest";
import {
  calculateRandomAncientGreekMusicalSymbol,
  randomAncientGreekMusicalSymbolExample,
  randomAncientGreekMusicalSymbolValueCount,
  runRandomAncientGreekMusicalSymbol,
} from "./tool.js";

describe("Random Ancient Greek Musical Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomAncientGreekMusicalSymbol(
        randomAncientGreekMusicalSymbolExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𝈀" } });
    expect(
      runRandomAncientGreekMusicalSymbol(
        randomAncientGreekMusicalSymbolExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𝉅" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomAncientGreekMusicalSymbolValueCount },
        (_, index) =>
          calculateRandomAncientGreekMusicalSymbol(
            () => (index + 0.5) / randomAncientGreekMusicalSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomAncientGreekMusicalSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomAncientGreekMusicalSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
