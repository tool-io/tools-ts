import { describe, expect, it } from "vitest";
import { ribReferenceParserExample, runRibReferenceParser } from "./tool.js";

describe("rib-reference-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRibReferenceParser(ribReferenceParserExample.input)).toEqual({
      ok: true,
      output: ribReferenceParserExample.output,
    });
  });

  it("parses explicit roman volumes case-insensitively", () => {
    expect(runRibReferenceParser({ reference: "rib ii 2456" })).toEqual({
      ok: true,
      output: { volumeRoman: "II", volumeNumber: 2, entryNumber: 2456 },
    });
  });
  it("rejects malformed numerals and punctuation", () => {
    expect(runRibReferenceParser({ reference: "RIB VV 3" }).ok).toBe(false);
    expect(runRibReferenceParser({ reference: "RIB II, 2456" }).ok).toBe(false);
    expect(runRibReferenceParser({ reference: "RIB 0" }).ok).toBe(false);
  });
});
