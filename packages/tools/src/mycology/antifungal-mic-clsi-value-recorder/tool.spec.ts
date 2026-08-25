import { describe, expect, it } from "vitest";
import {
  micValueRecorderExample,
  micValueRecorderTool,
  runMicValueRecorder,
} from "./tool.js";

describe("MIC Value Recorder", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMicValueRecorder(micValueRecorderExample.input)).toEqual({
      ok: true,
      output: micValueRecorderExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(micValueRecorderExample))).toEqual(
      micValueRecorderExample,
    );
    expect(micValueRecorderTool.contractVersion).toBe(1);
    expect(micValueRecorderTool.execution).toEqual({ kind: "pure" });
  });

  it("records zero without inventing an interpretation", () => {
    const result = runMicValueRecorder({ micMgPerL: 0 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toEqual({
        interpretation: "not-interpreted",
        micValueMgPerL: 0,
      });
  });

  it("preserves a fractional MIC", () => {
    const result = runMicValueRecorder({ micMgPerL: 0.5 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.micValueMgPerL).toBe(0.5);
  });

  it("rejects negative concentrations", () => {
    expect(runMicValueRecorder({ micMgPerL: -0.25 }).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runMicValueRecorder(null).ok).toBe(false);
    expect(runMicValueRecorder({ micMgPerL: "1" }).ok).toBe(false);
    expect(runMicValueRecorder({ micValue: 1 }).ok).toBe(false);
  });
});
