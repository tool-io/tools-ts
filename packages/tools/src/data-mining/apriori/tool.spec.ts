import { describe, expect, it } from "vitest";
import { aprioriExample, mineFrequentItemsets, runApriori } from "./tool.js";
describe("Apriori", () => {
  it("finds supported pairs", () =>
    expect(
      mineFrequentItemsets([["a", "b"], ["a", "b"], ["a"]], 2 / 3, 2)
        ?.frequentItemsets,
    ).toContainEqual({ count: 2, items: ["a", "b"], support: 0.666666666667 }));
  it("publishes an executable example", () =>
    expect(runApriori(aprioriExample.input)).toEqual({
      ok: true,
      output: aprioriExample.output,
    }));
});
