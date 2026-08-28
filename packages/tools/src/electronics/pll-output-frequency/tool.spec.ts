import { describe, expect, it } from "vitest";
import {
  calculatePllOutputFrequency,
  pllOutputFrequencyExample,
  runPllOutputFrequency,
} from "./tool.js";

describe("PLL Output Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPllOutputFrequency(pllOutputFrequencyExample.input)).toEqual({
      ok: true,
      output: pllOutputFrequencyExample.output,
    });
  });

  it("passes the reference through with unit dividers", () => {
    expect(
      runPllOutputFrequency({
        feedbackDivideInt: 1,
        referenceDivideInt: 1,
        referenceHz: 26000000,
      }),
    ).toEqual({ ok: true, output: { outputFrequencyHz: 26000000 } });
  });

  it("scales linearly with the feedback divider", () => {
    const base = calculatePllOutputFrequency({
      feedbackDivideInt: 10,
      referenceDivideInt: 4,
      referenceHz: 16000000,
    }).outputFrequencyHz;
    expect(base).toBe(40000000);
    expect(
      calculatePllOutputFrequency({
        feedbackDivideInt: 20,
        referenceDivideInt: 4,
        referenceHz: 16000000,
      }).outputFrequencyHz,
    ).toBe(base * 2);
  });

  it("divides down when the reference divider grows", () => {
    expect(
      calculatePllOutputFrequency({
        feedbackDivideInt: 24,
        referenceDivideInt: 1,
        referenceHz: 13000000,
      }).outputFrequencyHz,
    ).toBe(312000000);
  });

  it("rejects a zero feedback divider through execution", () => {
    expect(
      runPllOutputFrequency({
        feedbackDivideInt: 0,
        referenceDivideInt: 1,
        referenceHz: 10000000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "feedbackDivideInt" }],
      },
      ok: false,
    });
  });

  it("rejects fractional dividers through execution", () => {
    expect(
      runPllOutputFrequency({
        feedbackDivideInt: 2.5,
        referenceDivideInt: 1,
        referenceHz: 10000000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "feedbackDivideInt" }],
      },
      ok: false,
    });
  });

  it("rejects zero reference frequency with a stable code", () => {
    expect(
      runPllOutputFrequency({
        feedbackDivideInt: 8,
        referenceDivideInt: 1,
        referenceHz: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_frequency", field: "referenceHz" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runPllOutputFrequency({
        ...pllOutputFrequencyExample.input,
        nCounter: 4,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "nCounter" }] },
      ok: false,
    });
  });
});
