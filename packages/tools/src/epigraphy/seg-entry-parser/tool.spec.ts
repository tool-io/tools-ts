import { describe, expect, it } from "vitest";
import { segEntryParserExample, runSegEntryParser } from "./tool.js";

describe("seg-entry-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSegEntryParser(segEntryParserExample.input)).toEqual({
      ok: true,
      output: segEntryParserExample.output,
    });
  });

  it("parses letter suffixes case-insensitively", () => {
    expect(runSegEntryParser({ reference: "seg 48, 1330a" })).toEqual({
      ok: true,
      output: { volumeNumber: 48, entryNumber: 1330, letterSuffix: "a" },
    });
  });
  it("rejects roman numeral volumes", () => {
    expect(runSegEntryParser({ reference: "SEG XLI, 785" }).ok).toBe(false);
    expect(runSegEntryParser({ reference: "SEG 41, 0" }).ok).toBe(false);
  });
});
