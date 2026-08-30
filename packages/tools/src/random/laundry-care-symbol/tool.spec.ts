import { describe, expect, it } from "vitest";
import {
  calculateRandomLaundryCareSymbol,
  randomLaundryCareSymbolExample,
  randomLaundryCareSymbolValueCount,
  runRandomLaundryCareSymbol,
} from "./tool.js";

describe("Random Laundry Care Symbol Generator", () => {
  it("selects the first and last supported values with injected randomness", () => {
    expect(
      runRandomLaundryCareSymbol(randomLaundryCareSymbolExample.input, {
        random: () => 0,
      }),
    ).toEqual({ ok: true, output: { value: "wash" } });
    expect(
      runRandomLaundryCareSymbol(randomLaundryCareSymbolExample.input, {
        random: () => 1 - Number.EPSILON,
      }),
    ).toEqual({ ok: true, output: { value: "professional-care" } });
  });

  it("makes every declared repertoire value reachable", () => {
    const selected = new Set(
      Array.from(
        { length: randomLaundryCareSymbolValueCount },
        (_, index) =>
          calculateRandomLaundryCareSymbol(
            () => (index + 0.5) / randomLaundryCareSymbolValueCount,
          )?.value,
      ),
    );
    expect(selected).not.toContain(undefined);
    expect(selected.size).toBe(randomLaundryCareSymbolValueCount);
  });

  it("rejects an invalid injected random sample", () => {
    expect(runRandomLaundryCareSymbol({}, { random: () => 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_random_source" }] },
      ok: false,
    });
  });
});
