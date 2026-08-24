import { describe, expect, it } from "vitest";
import {
  calculateQxFromMx,
  qxProbabilityDeathFromMxExample,
  qxProbabilityDeathFromMxTool,
  runQxProbabilityDeathFromMx,
} from "./tool.js";

describe("qxProbabilityDeathFromMxTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runQxProbabilityDeathFromMx(qxProbabilityDeathFromMxExample.input),
    ).toEqual({
      ok: true,
      output: qxProbabilityDeathFromMxExample.output,
    });
  });

  it("applies the standard nMx-to-nqx conversion and defaults a(x) to n/2", () => {
    expect(calculateQxFromMx({ intervalN: 2, mxRate: 0.1 })).toEqual({
      qxProbability: 0.2 / 1.1,
    });
    const result = runQxProbabilityDeathFromMx({
      axYears: 1,
      intervalN: 1,
      mxRate: 2,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].code).toBe("invalid_probability");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(qxProbabilityDeathFromMxExample))).toEqual(
      qxProbabilityDeathFromMxExample,
    );
    expect(qxProbabilityDeathFromMxTool.contractVersion).toBe(1);
    expect(qxProbabilityDeathFromMxTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runQxProbabilityDeathFromMx(null).ok).toBe(false);
    expect(
      runQxProbabilityDeathFromMx({
        ...qxProbabilityDeathFromMxExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
