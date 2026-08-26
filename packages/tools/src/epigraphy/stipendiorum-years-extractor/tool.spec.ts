import { describe, expect, it } from "vitest";
import {
  calculateStipendiorumYearsExtractor,
  runStipendiorumYearsExtractor,
  stipendiorumYearsExtractorExample,
} from "./tool.js";

describe("epigraphy/stipendiorum-years-extractor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStipendiorumYearsExtractor(stipendiorumYearsExtractorExample.input),
    ).toEqual({ ok: true, output: stipendiorumYearsExtractorExample.output });
  });

  it("parses abbreviated stip. tokens and decimal counts", () => {
    expect(calculateStipendiorumYearsExtractor({ text: "stip. XXV" })).toEqual({
      found: true,
      years: 25,
      token: "stip. XXV",
    });
    expect(
      calculateStipendiorumYearsExtractor({ text: "stipendia 20" }),
    ).toEqual({
      found: true,
      years: 20,
      token: "stipendia 20",
    });
  });

  it("reports absence without a service formula", () => {
    expect(
      calculateStipendiorumYearsExtractor({ text: "vixit annis XXX" }),
    ).toEqual({ found: false, years: 0, token: "" });
  });

  it("rejects blank text", () => {
    expect(runStipendiorumYearsExtractor({ text: "" }).ok).toBe(false);
  });
});
