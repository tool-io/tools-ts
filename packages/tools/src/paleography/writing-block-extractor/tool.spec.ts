import { describe, expect, it } from "vitest";
import {
  runWritingBlockExtractor,
  writingBlockExtractorExample,
} from "./tool.js";

describe("writing-block-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWritingBlockExtractor(writingBlockExtractorExample.input),
    ).toEqual({ ok: true, output: writingBlockExtractorExample.output });
  });

  it("rejects margins wider than the page", () => {
    expect(
      runWritingBlockExtractor({
        pageWidthMm: 100,
        pageHeightMm: 140,
        topMarginMm: 10,
        bottomMarginMm: 10,
        innerMarginMm: 60,
        outerMarginMm: 60,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive measurements", () => {
    expect(
      runWritingBlockExtractor({
        pageWidthMm: -1,
        pageHeightMm: 300,
        topMarginMm: 10,
        bottomMarginMm: 10,
        innerMarginMm: 10,
        outerMarginMm: 10,
      }).ok,
    ).toBe(false);
  });
});
