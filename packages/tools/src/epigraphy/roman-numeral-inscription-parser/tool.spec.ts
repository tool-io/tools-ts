import { describe, expect, it } from "vitest";
import {
  calculateRomanNumeralInscriptionParser,
  romanNumeralInscriptionParserExample,
  runRomanNumeralInscriptionParser,
} from "./tool.js";

describe("epigraphy/roman-numeral-inscription-parser", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRomanNumeralInscriptionParser(
        romanNumeralInscriptionParserExample.input,
      ),
    ).toEqual({
      ok: true,
      output: romanNumeralInscriptionParserExample.output,
    });
  });

  it("applies classical subtractive pairs", () => {
    const result = calculateRomanNumeralInscriptionParser({
      numeral: "MCMLXXXIV",
    });
    expect(result.value).toBe(1984);
    expect(result.symbolCount).toBe(9);
    expect(
      calculateRomanNumeralInscriptionParser({
        numeral: "DCCCXC",
        repetitionPolicy: "maxThree",
      }).value,
    ).toBe(890);
  });

  it("honors the epigraphic fourfold repetition allowance", () => {
    expect(
      calculateRomanNumeralInscriptionParser({ numeral: "IIII" }).value,
    ).toBe(4);
    expect(() =>
      calculateRomanNumeralInscriptionParser({
        numeral: "IIII",
        repetitionPolicy: "maxThree",
      }),
    ).toThrow();
  });

  it("rejects invalid symbols and forbidden subtractive pairs", () => {
    expect(runRomanNumeralInscriptionParser({ numeral: "AB" }).ok).toBe(false);
    expect(runRomanNumeralInscriptionParser({ numeral: "IL" }).ok).toBe(false);
    expect(runRomanNumeralInscriptionParser({ numeral: "IIX" }).ok).toBe(false);
    expect(runRomanNumeralInscriptionParser({ numeral: "IXC" }).ok).toBe(false);
    expect(runRomanNumeralInscriptionParser({ numeral: "" }).ok).toBe(false);
  });
});
