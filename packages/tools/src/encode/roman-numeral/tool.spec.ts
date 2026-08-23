import { describe, expect, it } from "vitest";
import {
  romanNumeralExample,
  calculateRomanNumeral,
  runRomanNumeral,
} from "./tool.js";

describe("encode/roman-numeral", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRomanNumeral(romanNumeralExample.input)).toEqual({
      ok: true,
      output: romanNumeralExample.output,
    });
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runRomanNumeral({ value: 0 }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_field)", () => {
    expect(runRomanNumeral({ value: 4000 }).ok).toBe(false);
  });
});
