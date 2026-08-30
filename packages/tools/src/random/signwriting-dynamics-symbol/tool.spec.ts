import { describe, expect, it } from "vitest";
import {
  calculateRandomSignwritingDynamicsSymbol,
  randomSignwritingDynamicsSymbolExample,
  randomSignwritingDynamicsSymbolValueCount,
  runRandomSignwritingDynamicsSymbol,
} from "./tool.js";

describe("Random SignWriting Dynamics Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomSignwritingDynamicsSymbol(
        randomSignwritingDynamicsSymbolExample.input,
        { random: () => 0 },
      ),
    ).toEqual({ ok: true, output: { value: "𝧵" } });
    expect(
      runRandomSignwritingDynamicsSymbol(
        randomSignwritingDynamicsSymbolExample.input,
        { random: () => 1 - Number.EPSILON },
      ),
    ).toEqual({ ok: true, output: { value: "𝧾" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomSignwritingDynamicsSymbolValueCount },
        (_, index) =>
          calculateRandomSignwritingDynamicsSymbol(
            () => (index + 0.5) / randomSignwritingDynamicsSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomSignwritingDynamicsSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(
      runRandomSignwritingDynamicsSymbol({}, { random: () => 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
