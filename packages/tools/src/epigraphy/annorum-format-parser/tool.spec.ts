import { describe, expect, it } from "vitest";
import {
  annorumFormatParserExample,
  calculateAnnorumFormatParser,
  runAnnorumFormatParser,
} from "./tool.js";

describe("epigraphy/annorum-format-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAnnorumFormatParser(annorumFormatParserExample.input)).toEqual({
      ok: true,
      output: annorumFormatParserExample.output,
    });
  });

  it("parses interpunct and decimal variants", () => {
    expect(calculateAnnorumFormatParser({ text: "annorum·XVIII" })).toEqual({
      found: true,
      years: 18,
      token: "annorum·XVIII",
      notation: "roman",
    });
    expect(calculateAnnorumFormatParser({ text: "annorum 30" })).toEqual({
      found: true,
      years: 30,
      token: "annorum 30",
      notation: "decimal",
    });
  });

  it("reports not-found without a notation", () => {
    expect(calculateAnnorumFormatParser({ text: "vixit annis XX" })).toEqual({
      found: false,
      years: 0,
      token: "",
      notation: "none",
    });
  });

  it("rejects blank text", () => {
    expect(runAnnorumFormatParser({ text: "" }).ok).toBe(false);
  });
});
