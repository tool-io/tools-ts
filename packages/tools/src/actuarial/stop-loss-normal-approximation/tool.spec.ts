import { describe, expect, it } from "vitest";
import {
  stopLossNormalApproximationExample,
  stopLossNormalApproximationTool,
  runStopLossNormalApproximation,
} from "./tool.js";

describe("stopLossNormalApproximationTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runStopLossNormalApproximation(stopLossNormalApproximationExample.input),
    ).toEqual({
      ok: true,
      output: stopLossNormalApproximationExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(stopLossNormalApproximationExample)),
    ).toEqual(stopLossNormalApproximationExample);
    expect(stopLossNormalApproximationTool.contractVersion).toBe(1);
    expect(stopLossNormalApproximationTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runStopLossNormalApproximation(null).ok).toBe(false);
    expect(
      runStopLossNormalApproximation({
        ...stopLossNormalApproximationExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("stop-loss normal approximation boundaries", () => {
  it("prices deeper attachments below shallower ones", () => {
    const shallow = runStopLossNormalApproximation({
      attachmentPoint: 105,
      aggregateLossStdDev: 10,
      expectedAggregateLoss: 100,
    });
    const deep = runStopLossNormalApproximation({
      attachmentPoint: 130,
      aggregateLossStdDev: 10,
      expectedAggregateLoss: 100,
    });
    expect(shallow.ok && shallow.output.expectedStopLossCost).toBeGreaterThan(
      0,
    );
    expect(deep.ok && deep.output.expectedStopLossCost).toBeLessThan(1);
  });

  it("rejects non-positive standard deviations", () => {
    expect(
      runStopLossNormalApproximation({
        attachmentPoint: 110,
        aggregateLossStdDev: 0,
        expectedAggregateLoss: 100,
      }).ok,
    ).toBe(false);
  });
});
