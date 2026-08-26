import { describe, expect, it } from "vitest";
import { aeReferenceParserExample, runAeReferenceParser } from "./tool.js";

describe("ae-reference-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAeReferenceParser(aeReferenceParserExample.input)).toEqual({
      ok: true,
      output: aeReferenceParserExample.output,
    });
  });

  it("parses letter suffixes case-insensitively", () => {
    expect(runAeReferenceParser({ reference: "ae 1972, 123b" })).toEqual({
      ok: true,
      output: {
        year: 1972,
        itemNumber: 123,
        prefixedPlus: false,
        letterSuffix: "b",
      },
    });
  });
  it("rejects two-digit years", () => {
    expect(runAeReferenceParser({ reference: "AE 96, 12" }).ok).toBe(false);
    expect(runAeReferenceParser({ reference: "AE 1996, 0" }).ok).toBe(false);
  });
});
