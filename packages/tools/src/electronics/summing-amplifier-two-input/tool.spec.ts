import { describe, expect, it } from "vitest";
import {
  calculateSummingAmplifierTwoInput,
  runSummingAmplifierTwoInput,
  summingAmplifierTwoInputExample,
} from "./tool.js";

describe("Summing Amp Output", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSummingAmplifierTwoInput(summingAmplifierTwoInputExample.input),
    ).toEqual({
      ok: true,
      output: summingAmplifierTwoInputExample.output,
    });
  });

  it("inverts positive inputs", () => {
    expect(
      calculateSummingAmplifierTwoInput({
        rfKohm: 1,
        v1: 1,
        r1Kohm: 1,
        v2: 1,
        r2Kohm: 1,
      }).summingOutputVolts,
    ).toBe(-2);
  });

  it("supports signed input voltages", () => {
    expect(
      calculateSummingAmplifierTwoInput({
        rfKohm: 10,
        v1: 1,
        r1Kohm: 10,
        v2: -2,
        r2Kohm: 5,
      }).summingOutputVolts,
    ).toBeCloseTo(3);
  });

  it("weights inputs by their resistance ratio", () => {
    expect(
      calculateSummingAmplifierTwoInput({
        rfKohm: 10,
        v1: 1,
        r1Kohm: 1,
        v2: 0,
        r2Kohm: 10,
      }).summingOutputVolts,
    ).toBe(-10);
  });

  it("outputs zero for grounded inputs", () => {
    expect(
      calculateSummingAmplifierTwoInput({
        rfKohm: 5,
        v1: 0,
        r1Kohm: 1,
        v2: 0,
        r2Kohm: 2,
      }).summingOutputVolts,
    ).toBe(-0);
  });

  it("rejects zero feedback resistance", () => {
    expect(
      runSummingAmplifierTwoInput({
        rfKohm: 0,
        v1: 1,
        r1Kohm: 1,
        v2: 1,
        r2Kohm: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_rf_kohm" }] },
      ok: false,
    });
  });

  it("rejects zero input 1 resistance", () => {
    expect(
      runSummingAmplifierTwoInput({
        rfKohm: 10,
        v1: 1,
        r1Kohm: 0,
        v2: 1,
        r2Kohm: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_r1_kohm" }] },
      ok: false,
    });
  });

  it("rejects negative input 2 resistance", () => {
    expect(
      runSummingAmplifierTwoInput({
        rfKohm: 10,
        v1: 1,
        r1Kohm: 1,
        v2: 1,
        r2Kohm: -2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_r2_kohm" }] },
      ok: false,
    });
  });
});
