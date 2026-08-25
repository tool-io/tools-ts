import { describe, expect, it } from "vitest";
import {
  rhizomorphRateRecorderExample,
  rhizomorphRateRecorderTool,
  runRhizomorphRateRecorder,
} from "./tool.js";

describe("Rhizomorph Extension Rate", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runRhizomorphRateRecorder(rhizomorphRateRecorderExample.input),
    ).toEqual({
      ok: true,
      output: rhizomorphRateRecorderExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(rhizomorphRateRecorderExample))).toEqual(
      rhizomorphRateRecorderExample,
    );
    expect(rhizomorphRateRecorderTool.contractVersion).toBe(1);
    expect(rhizomorphRateRecorderTool.execution).toEqual({ kind: "pure" });
  });

  it("records a zero rate for a stalled rhizomorph", () => {
    const result = runRhizomorphRateRecorder({
      extensionMm: 0,
      daysElapsedInt: 7,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.rhizomorphExtensionMmPerDay).toBe(0);
  });

  it("divides extension by elapsed days exactly", () => {
    const result = runRhizomorphRateRecorder({
      extensionMm: 30,
      daysElapsedInt: 4,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.rhizomorphExtensionMmPerDay).toBeCloseTo(7.5, 12);
  });

  it("accepts a single day of growth", () => {
    const result = runRhizomorphRateRecorder({
      extensionMm: 2.5,
      daysElapsedInt: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.rhizomorphExtensionMmPerDay).toBe(2.5);
  });

  it("rejects negative extension and zero or negative days", () => {
    expect(
      runRhizomorphRateRecorder({ extensionMm: -1, daysElapsedInt: 5 }).ok,
    ).toBe(false);
    expect(
      runRhizomorphRateRecorder({ extensionMm: 10, daysElapsedInt: 0 }).ok,
    ).toBe(false);
    expect(
      runRhizomorphRateRecorder({ extensionMm: 10, daysElapsedInt: -2 }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runRhizomorphRateRecorder(null).ok).toBe(false);
    expect(runRhizomorphRateRecorder({ extensionMm: 45 }).ok).toBe(false);
    expect(
      runRhizomorphRateRecorder({ extensionMm: 45, daysElapsedInt: 2.5 }).ok,
    ).toBe(false);
  });
});
