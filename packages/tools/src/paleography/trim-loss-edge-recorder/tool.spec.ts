import { describe, expect, it } from "vitest";
import {
  runTrimLossEdgeRecorder,
  trimLossEdgeRecorderExample,
} from "./tool.js";

describe("trim-loss-edge-recorder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTrimLossEdgeRecorder(trimLossEdgeRecorderExample.input)).toEqual({
      ok: true,
      output: trimLossEdgeRecorderExample.output,
    });
  });

  it("records zero loss for an untrimmed sheet", () => {
    const result = runTrimLossEdgeRecorder({
      originalSheetHeightMm: 250,
      originalSheetWidthMm: 350,
      trimmedPageHeightMm: 250,
      trimmedPageWidthMm: 350,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.lostAreaSquareCm as number).toBe(0);
    expect(result.output.areaLossPercent as number).toBe(0);
  });

  it("rejects a trimmed page larger than the sheet", () => {
    expect(
      runTrimLossEdgeRecorder({
        originalSheetHeightMm: 200,
        originalSheetWidthMm: 200,
        trimmedPageHeightMm: 200,
        trimmedPageWidthMm: 250,
      }).ok,
    ).toBe(false);
  });
});
