import { describe, expect, it } from "vitest";
import {
  romanNumeralExample,
  calculateRomanNumeral,
  runRomanNumeral,
} from "./tool.js";

describe("decode/roman-numeral", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRomanNumeral(romanNumeralExample.input)).toEqual({
      ok: true,
      output: romanNumeralExample.output,
    });
  });
  it("rejects invalid input (invalid_roman_numeral)", () => {
    expect(runRomanNumeral({ roman: "IIII" }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_roman_numeral)", () => {
    expect(runRomanNumeral({ roman: "VX" }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_roman_numeral)", () => {
    expect(runRomanNumeral({ roman: "" }).ok).toBe(false);
  });
});
