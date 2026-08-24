import { describe, expect, it } from "vitest";
import {
  calculateSevereMaterialDeprivation,
  severeMaterialDeprivationRateEuExample,
  severeMaterialDeprivationRateEuTool,
  runSevereMaterialDeprivationRateEu,
} from "./tool.js";

describe("severeMaterialDeprivationRateEuTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSevereMaterialDeprivationRateEu(
        severeMaterialDeprivationRateEuExample.input,
      ),
    ).toEqual({
      ok: true,
      output: severeMaterialDeprivationRateEuExample.output,
    });
  });

  it("returns the deprived-person share and accepts zero deprivation", () => {
    expect(
      calculateSevereMaterialDeprivation({
        severelyDeprivedPersons: 0,
        totalPopulation: 200,
      }),
    ).toEqual({ deprivationRatePercent: 0 });
    const result = runSevereMaterialDeprivationRateEu({
      severelyDeprivedPersons: 201,
      totalPopulation: 200,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("severelyDeprivedPersons");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(severeMaterialDeprivationRateEuExample)),
    ).toEqual(severeMaterialDeprivationRateEuExample);
    expect(severeMaterialDeprivationRateEuTool.contractVersion).toBe(1);
    expect(severeMaterialDeprivationRateEuTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSevereMaterialDeprivationRateEu(null).ok).toBe(false);
    expect(
      runSevereMaterialDeprivationRateEu({
        ...severeMaterialDeprivationRateEuExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
