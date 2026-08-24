import { describe, expect, it } from "vitest";
import {
  feastdayAnchorExtractorExample,
  runFeastdayAnchorExtractor,
} from "./tool.js";

describe("feastday-anchor-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFeastdayAnchorExtractor(feastdayAnchorExtractorExample.input),
    ).toEqual({ ok: true, output: feastdayAnchorExtractorExample.output });
  });

  it("prefers the earliest feast mentioned in the text", () => {
    expect(
      runFeastdayAnchorExtractor({
        charterText:
          "Datum in festo sancti Nicholai; testibus qui ad Michaelmas convenerant.",
      }),
    ).toEqual({
      ok: true,
      output: {
        anchorName: "Feast of St Nicholas",
        fixedDate: "12-06",
        monthBand: "december",
        matchedAlias: "nicholai",
      },
    });
  });

  it("rejects text without any known feast", () => {
    expect(
      runFeastdayAnchorExtractor({ charterText: "Anno regni regis quarto." })
        .ok,
    ).toBe(false);
  });

  it("does not match a feast alias inside a larger word", () => {
    expect(
      runFeastdayAnchorExtractor({
        charterText: "The witness later settled in Nicholasville.",
      }).ok,
    ).toBe(false);
  });
});
