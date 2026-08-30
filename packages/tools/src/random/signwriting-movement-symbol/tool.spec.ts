import { describe, expect, it } from "vitest";
import {
  calculateRandomSignwritingMovementSymbol,
  randomSignwritingMovementSymbolExample,
  randomSignwritingMovementSymbolValueCount,
  runRandomSignwritingMovementSymbol,
} from "./tool.js";

describe("Random SignWriting Movement Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSignwritingMovementSymbol(
        randomSignwritingMovementSymbolExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𝤡" } });
    expect(
      runRandomSignwritingMovementSymbol(
        randomSignwritingMovementSymbolExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𝩩" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSignwritingMovementSymbolValueCount },
        (_, index) =>
          calculateRandomSignwritingMovementSymbol(
            () => (index + 0.5) / randomSignwritingMovementSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSignwritingMovementSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSignwritingMovementSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
