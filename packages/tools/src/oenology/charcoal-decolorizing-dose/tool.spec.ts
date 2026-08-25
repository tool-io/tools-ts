import { describe, expect, it } from "vitest";
import {
  charcoalDecolorizingDoseExample,
  charcoalDecolorizingDoseTool,
  runCharcoalDecolorizingDose,
} from "./tool.js";

describe("charcoalDecolorizingDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runCharcoalDecolorizingDose(charcoalDecolorizingDoseExample.input),
    ).toEqual({
      ok: true,
      output: charcoalDecolorizingDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(charcoalDecolorizingDoseExample))).toEqual(
      charcoalDecolorizingDoseExample,
    );
    expect(charcoalDecolorizingDoseTool.contractVersion).toBe(1);
    expect(charcoalDecolorizingDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCharcoalDecolorizingDose(null).ok).toBe(false);
    expect(
      runCharcoalDecolorizingDose({
        ...charcoalDecolorizingDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("compares against the supplied treatment cap", () => {
    expect(
      runCharcoalDecolorizingDose({
        maximumRateGPerHectoliter: 20,
        rateGPerHectoliter: 25,
        volumeHectoliters: 2,
      }),
    ).toEqual({
      ok: true,
      output: { charcoalGrams: 50, withinRecommendedCap: false },
    });
  });
});
