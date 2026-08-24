import { describe, expect, it } from "vitest";
import {
  calculateTempoAdjustedTfr,
  tempoAdjustedTfrBongaartsExample,
  tempoAdjustedTfrBongaartsTool,
  runTempoAdjustedTfrBongaarts,
} from "./tool.js";

describe("tempoAdjustedTfrBongaartsTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runTempoAdjustedTfrBongaarts(tempoAdjustedTfrBongaartsExample.input),
    ).toEqual({
      ok: true,
      output: tempoAdjustedTfrBongaartsExample.output,
    });
  });

  it("leaves TFR unchanged without tempo shift and rejects a zero denominator", () => {
    expect(
      calculateTempoAdjustedTfr({
        meanAgeAnnualChangeYears: 0,
        observedTfr: 1.8,
      }),
    ).toEqual({ tempoAdjustedTfr: 1.8 });
    const result = runTempoAdjustedTfrBongaarts({
      meanAgeAnnualChangeYears: 1,
      observedTfr: 1.8,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("meanAgeAnnualChangeYears");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(tempoAdjustedTfrBongaartsExample)),
    ).toEqual(tempoAdjustedTfrBongaartsExample);
    expect(tempoAdjustedTfrBongaartsTool.contractVersion).toBe(1);
    expect(tempoAdjustedTfrBongaartsTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTempoAdjustedTfrBongaarts(null).ok).toBe(false);
    expect(
      runTempoAdjustedTfrBongaarts({
        ...tempoAdjustedTfrBongaartsExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
