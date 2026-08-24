import { describe, expect, it } from "vitest";
import {
  calculateCountryCodeAlpha2Validator,
  countryCodeAlpha2ValidatorExample,
  runCountryCodeAlpha2Validator,
} from "./tool.js";

describe("archival-studies/country-code-alpha2-validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCountryCodeAlpha2Validator(countryCodeAlpha2ValidatorExample.input),
    ).toEqual({ ok: true, output: countryCodeAlpha2ValidatorExample.output });
  });

  it("rejects wrong lengths, digits and non-ASCII letters", () => {
    expect(calculateCountryCodeAlpha2Validator({ code: "U" }).isValid).toBe(
      false,
    );
    expect(calculateCountryCodeAlpha2Validator({ code: "U5" }).isValid).toBe(
      false,
    );
    expect(
      calculateCountryCodeAlpha2Validator({ code: "DE" }).normalizedCode,
    ).toBe("DE");
    expect(calculateCountryCodeAlpha2Validator({ code: "ZZ" }).isValid).toBe(
      false,
    );
  });

  it("rejects empty codes", () => {
    expect(runCountryCodeAlpha2Validator({ code: " " }).ok).toBe(false);
  });
});
