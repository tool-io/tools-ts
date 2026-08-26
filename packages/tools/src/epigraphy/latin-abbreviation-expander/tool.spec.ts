import { describe, expect, it } from "vitest";
import {
  calculateLatinAbbreviationExpander,
  latinAbbreviationExpanderExample,
  runLatinAbbreviationExpander,
} from "./tool.js";

describe("epigraphy/latin-abbreviation-expander", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLatinAbbreviationExpander(latinAbbreviationExpanderExample.input),
    ).toEqual({ ok: true, output: latinAbbreviationExpanderExample.output });
  });

  it("leaves full forms untouched", () => {
    expect(calculateLatinAbbreviationExpander({ text: "DIS MANIBVS" })).toEqual(
      {
        expansionCount: 0,
        expandedText: "DIS MANIBVS",
        expansions: [],
      },
    );
  });

  it("prefers longer matches over prefixes", () => {
    expect(
      calculateLatinAbbreviationExpander({ text: "D M S VSLM" }).expansions,
    ).toEqual([
      "D M S -> Dis Manibus Sacrum",
      "VSLM -> Votum Solvit Libens Merito",
    ]);
  });

  it("rejects empty or dot-only input", () => {
    expect(runLatinAbbreviationExpander({ text: "" }).ok).toBe(false);
    expect(runLatinAbbreviationExpander({ text: "\u00B7 \u00B7" }).ok).toBe(
      false,
    );
  });
});
