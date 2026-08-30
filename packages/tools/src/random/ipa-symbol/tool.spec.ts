import { describe, expect, it } from "vitest";
import {
  calculateRandomIpaSymbol,
  randomIpaSymbolExample,
  randomIpaSymbolValueCount,
  runRandomIpaSymbol,
} from "./tool.js";

describe("Random IPA Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomIpaSymbol(randomIpaSymbolExample.input, { random: () => 0 }),
    ).toEqual({ ok: true, output: { value: "ɐ" } });
    expect(
      runRandomIpaSymbol(randomIpaSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "ᶿ" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomIpaSymbolValueCount },
        (_, index) =>
          calculateRandomIpaSymbol(
            () => (index + 0.5) / randomIpaSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomIpaSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomIpaSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
