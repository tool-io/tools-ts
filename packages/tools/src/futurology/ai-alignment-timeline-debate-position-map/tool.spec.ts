import { describe, expect, it } from "vitest";
import {
  aiAlignmentTimelineExample,
  mapAiAlignmentTimelineDebate,
  runAiAlignmentTimeline,
} from "./tool.js";

describe("AI alignment timeline debate position map", () => {
  it("reproduces its canonical example", () => {
    expect(runAiAlignmentTimeline(aiAlignmentTimelineExample.input)).toEqual({
      ok: true,
      output: aiAlignmentTimelineExample.output,
    });
  });

  it("sorts positions chronologically", () => {
    expect(
      mapAiAlignmentTimelineDebate({
        positionLabels: ["Later", "Earlier"],
        positionYears: [2100, 2020],
      }).timelineEntries,
    ).toEqual(["2020: Earlier", "2100: Later"]);
  });

  it("handles one position", () => {
    expect(
      mapAiAlignmentTimelineDebate({
        positionLabels: ["Only"],
        positionYears: [2050],
      }),
    ).toMatchObject({ earliestPositionYear: 2050, latestPositionYear: 2050 });
  });

  it("rejects a negative position year", () => {
    expect(
      runAiAlignmentTimeline({ positionLabels: ["A"], positionYears: [-1] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_position_year", field: "positionYears.0" }],
      },
      ok: false,
    });
  });
});
