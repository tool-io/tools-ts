import { describe, expect, it } from "vitest";
import { cilCitationParserExample, runCilCitationParser } from "./tool.js";

describe("cil-citation-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCilCitationParser(cilCitationParserExample.input)).toEqual({
      ok: true,
      output: cilCitationParserExample.output,
    });
  });

  it("converts arabic volumes to roman numerals", () => {
    expect(runCilCitationParser({ citation: "cil xvi, 3" })).toEqual({
      ok: true,
      output: { volumeNumber: 16, volumeRoman: "XVI", entryNumber: 3 },
    });
    expect(runCilCitationParser({ citation: "CIL 6.2, 1527" }).ok).toBe(false);
  });
  it("rejects citations without a comma", () => {
    expect(runCilCitationParser({ citation: "CIL VI 1527" }).ok).toBe(false);
    expect(runCilCitationParser({ citation: "CIL 0, 12" }).ok).toBe(false);
    expect(runCilCitationParser({ citation: "CIL VI, 0" }).ok).toBe(false);
  });
});
