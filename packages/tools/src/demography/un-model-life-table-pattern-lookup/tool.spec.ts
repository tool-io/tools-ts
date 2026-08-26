import { describe, expect, it } from "vitest";
import {
  calculateUnModelLifeTablePatternLookup,
  runUnModelLifeTablePatternLookup,
  unModelLifeTablePatternLookupExample,
} from "./tool.js";

describe("demography/un-model-life-table-pattern-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUnModelLifeTablePatternLookup(
        unModelLifeTablePatternLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: unModelLifeTablePatternLookupExample.output,
    });
  });

  it("labels every published pattern", () => {
    const patterns = (
      ["general", "chilean", "southAsian", "farEastern"] as const
    ).map((pattern) => calculateUnModelLifeTablePatternLookup({ pattern }));
    expect(patterns.map((entry) => entry.patternCode)).toEqual([
      "G",
      "CH",
      "SA",
      "FE",
    ]);
    expect(patterns[0]!.modelName).toBe("UN General pattern");
  });

  it("rejects unknown patterns", () => {
    expect(
      runUnModelLifeTablePatternLookup({ pattern: "african" as "general" }).ok,
    ).toBe(false);
  });
});
