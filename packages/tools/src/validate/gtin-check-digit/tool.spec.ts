import { describe, expect, it } from "vitest";
import { runGtinCheckDigit, gtinCheckDigitExample } from "./tool.js";

describe("GTIN Check Digit Validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGtinCheckDigit(gtinCheckDigitExample.input)).toEqual({
      ok: true,
      output: gtinCheckDigitExample.output,
    });
  });

  it("validates a complete GTIN-8", () => {
    expect(runGtinCheckDigit({ digits: "12345670", mode: "validate" })).toEqual(
      {
        ok: true,
        output: { valid: true, computedCheckDigit: 0, gtinKind: "GTIN-8" },
      },
    );
  });

  it("computes a GTIN-8 check digit from data digits only", () => {
    expect(runGtinCheckDigit({ digits: "1234567", mode: "compute" })).toEqual({
      ok: true,
      output: { valid: true, computedCheckDigit: 0, gtinKind: "GTIN-8" },
    });
  });

  it("validates a complete GTIN-13", () => {
    expect(
      runGtinCheckDigit({ digits: "5901234123457", mode: "validate" }),
    ).toEqual({
      ok: true,
      output: { valid: true, computedCheckDigit: 7, gtinKind: "GTIN-13" },
    });
  });

  it("validates a complete GTIN-14", () => {
    expect(
      runGtinCheckDigit({ digits: "12345678901231", mode: "validate" }),
    ).toEqual({
      ok: true,
      output: { valid: true, computedCheckDigit: 1, gtinKind: "GTIN-14" },
    });
  });

  it("rejects an invalid length", () => {
    const result = runGtinCheckDigit({ digits: "12345", mode: "validate" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("digits");
  });

  it("rejects invalid input", () =>
    expect(runGtinCheckDigit(null).ok).toBe(false));

  it("does not silently strip separators", () => {
    expect(
      runGtinCheckDigit({ digits: "1234-5670", mode: "validate" }).ok,
    ).toBe(false);
  });

  it("uses the explicit mode for ambiguous lengths", () => {
    expect(
      runGtinCheckDigit({ digits: "03600029145", mode: "compute" }),
    ).toMatchObject({
      ok: true,
      output: { computedCheckDigit: 2, gtinKind: "GTIN-12" },
    });
  });
});
