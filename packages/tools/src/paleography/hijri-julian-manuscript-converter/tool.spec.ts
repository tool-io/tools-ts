import { describe, expect, it } from "vitest";
import {
  hijriJulianManuscriptConverterExample,
  runHijriJulianManuscriptConverter,
} from "./tool.js";

describe("hijri-julian-manuscript-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHijriJulianManuscriptConverter(
        hijriJulianManuscriptConverterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hijriJulianManuscriptConverterExample.output,
    });
  });

  it("converts Julian 16 July 622 back to 1 Muharram 1 AH", () => {
    expect(
      runHijriJulianManuscriptConverter({
        mode: "julian_to_hijri",
        julianYear: 622,
        julianMonth: 7,
        julianDay: 16,
      }),
    ).toEqual({
      ok: true,
      output: hijriJulianManuscriptConverterExample.output,
    });
  });

  it("rejects a 30th day in an even lunar month", () => {
    expect(
      runHijriJulianManuscriptConverter({
        hijriYear: 2,
        hijriMonth: 2,
        hijriDay: 30,
      }).ok,
    ).toBe(false);
  });

  it("rejects an impossible Julian date", () => {
    expect(
      runHijriJulianManuscriptConverter({
        mode: "julian_to_hijri",
        julianYear: 623,
        julianMonth: 2,
        julianDay: 29,
      }).ok,
    ).toBe(false);
  });
});
