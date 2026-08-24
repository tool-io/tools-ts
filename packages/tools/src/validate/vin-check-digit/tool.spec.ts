import { describe, expect, it } from "vitest";
import { runVinCheckDigit, vinCheckDigitExample } from "./tool.js";
describe("vin check digit validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVinCheckDigit(vinCheckDigitExample.input)).toEqual({
      ok: true,
      output: vinCheckDigitExample.output,
    });
  });
  it("rejects truncated identifiers", () => {
    expect(
      runVinCheckDigit({ mode: "validate", vin: "1M8GDM9AXKP042788" }).ok,
    ).toBe(true);
    expect(runVinCheckDigit({ mode: "validate", vin: "SHORT" }).ok).toBe(false);
  });
  it("computes a missing ninth character", () => {
    expect(
      runVinCheckDigit({ mode: "compute", vin: "1M8GDM9AKP042788" }),
    ).toMatchObject({
      ok: true,
      output: { computedCheckChar: "X", valid: true },
    });
  });
  it("rejects forbidden and punctuation characters", () => {
    expect(
      runVinCheckDigit({ mode: "validate", vin: "1M8GDM9AOKP042788" }).ok,
    ).toBe(false);
    expect(
      runVinCheckDigit({ mode: "validate", vin: "1M8GDM9A-KP042788" }).ok,
    ).toBe(false);
  });
});
