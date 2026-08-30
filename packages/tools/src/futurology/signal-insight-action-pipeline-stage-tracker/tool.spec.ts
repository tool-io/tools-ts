import { describe, expect, it } from "vitest";
import {
  runSignalPipeline,
  signalPipelineExample,
  trackSignalInsightActionPipeline,
} from "./tool.js";

describe("signal insight action pipeline tracker", () => {
  it("reproduces its canonical example", () => {
    expect(runSignalPipeline(signalPipelineExample.input)).toEqual({
      ok: true,
      output: signalPipelineExample.output,
    });
  });

  it("reports items stalled at the signal stage", () => {
    expect(
      trackSignalInsightActionPipeline({
        actionIds: ["A"],
        currentStages: ["signal"],
        insightIds: ["I"],
        signalIds: ["S"],
      }),
    ).toMatchObject({ stalledItemIds: ["S|I|A"] });
  });

  it("counts completed items", () => {
    expect(
      trackSignalInsightActionPipeline({
        actionIds: ["A"],
        currentStages: ["completed"],
        insightIds: ["I"],
        signalIds: ["S"],
      }).stageCounts,
    ).toEqual([0, 0, 0, 1]);
  });

  it("rejects an invalid pipeline stage", () => {
    expect(
      runSignalPipeline({
        actionIds: ["A"],
        currentStages: ["decided"],
        insightIds: ["I"],
        signalIds: ["S"],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_pipeline_stage", field: "currentStages.0" }],
      },
      ok: false,
    });
  });
});
