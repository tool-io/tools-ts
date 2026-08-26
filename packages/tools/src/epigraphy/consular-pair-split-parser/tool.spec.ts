import { describe, expect, it } from "vitest";
import {
  calculateConsularPairSplitParser,
  consularPairSplitParserExample,
  runConsularPairSplitParser,
} from "./tool.js";

describe("epigraphy/consular-pair-split-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConsularPairSplitParser(consularPairSplitParserExample.input),
    ).toEqual({ ok: true, output: consularPairSplitParserExample.output });
  });

  it("trims surrounding whitespace around each consul", () => {
    expect(
      calculateConsularPairSplitParser({
        consuls: "  A. Hirtius , C. Vibius Pansa  ",
      }),
    ).toEqual({
      consulPrior: "A. Hirtius",
      consulPosterior: "C. Vibius Pansa",
    });
  });

  it("rejects lines without exactly two consuls", () => {
    expect(
      runConsularPairSplitParser({ consuls: "Sulla sole consul" }).ok,
    ).toBe(false);
    expect(
      runConsularPairSplitParser({ consuls: "A, B, C suffect added" }).ok,
    ).toBe(false);
  });
});
