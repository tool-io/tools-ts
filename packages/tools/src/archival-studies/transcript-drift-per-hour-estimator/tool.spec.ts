import { describe, expect, it } from "vitest";
import {
  calculateTranscriptDriftPerHourEstimator,
  runTranscriptDriftPerHourEstimator,
  transcriptDriftPerHourEstimatorExample,
} from "./tool.js";

describe("archival-studies/transcript-drift-per-hour-estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTranscriptDriftPerHourEstimator(
        transcriptDriftPerHourEstimatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: transcriptDriftPerHourEstimatorExample.output,
    });
  });

  it("accounts for a non-zero starting offset", () => {
    const result = calculateTranscriptDriftPerHourEstimator({
      offsetStartSeconds: -2,
      offsetEndSeconds: 4,
      elapsedHours: 2,
    });
    expect(result.totalDriftSeconds).toBe(6);
    expect(result.driftPerHour).toBe(3);
  });

  it("rejects zero elapsed hours", () => {
    expect(
      runTranscriptDriftPerHourEstimator({
        offsetEndSeconds: 4.5,
        elapsedHours: 0,
      }).ok,
    ).toBe(false);
  });
});
