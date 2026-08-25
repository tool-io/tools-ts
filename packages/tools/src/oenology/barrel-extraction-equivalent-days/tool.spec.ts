import { describe, expect, it } from "vitest";
import {
  barrelExtractionEquivalentDaysExample,
  barrelExtractionEquivalentDaysTool,
  runBarrelExtractionEquivalentDays,
} from "./tool.js";

describe("barrelExtractionEquivalentDaysTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runBarrelExtractionEquivalentDays(
        barrelExtractionEquivalentDaysExample.input,
      ),
    ).toEqual({
      ok: true,
      output: barrelExtractionEquivalentDaysExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(barrelExtractionEquivalentDaysExample)),
    ).toEqual(barrelExtractionEquivalentDaysExample);
    expect(barrelExtractionEquivalentDaysTool.contractVersion).toBe(1);
    expect(barrelExtractionEquivalentDaysTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBarrelExtractionEquivalentDays(null).ok).toBe(false);
    expect(
      runBarrelExtractionEquivalentDays({
        ...barrelExtractionEquivalentDaysExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("uses the supplied extraction factor without inventing an age curve", () => {
    expect(
      runBarrelExtractionEquivalentDays({
        contactDays: 90,
        relativeExtractionPercent: 40,
      }),
    ).toEqual({ ok: true, output: { equivalentNewBarrelDays: 36 } });
  });
});
