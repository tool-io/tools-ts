import { describe, expect, it } from "vitest";
import {
  calculateRandomByzantineMusicalSymbol,
  randomByzantineMusicalSymbolExample,
  randomByzantineMusicalSymbolValueCount,
  runRandomByzantineMusicalSymbol,
} from "./tool.js";

describe("Random Byzantine Musical Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomByzantineMusicalSymbol(
        randomByzantineMusicalSymbolExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𝀀" } });
    expect(
      runRandomByzantineMusicalSymbol(
        randomByzantineMusicalSymbolExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𝃵" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomByzantineMusicalSymbolValueCount },
        (_, index) =>
          calculateRandomByzantineMusicalSymbol(
            () => (index + 0.5) / randomByzantineMusicalSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomByzantineMusicalSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomByzantineMusicalSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
