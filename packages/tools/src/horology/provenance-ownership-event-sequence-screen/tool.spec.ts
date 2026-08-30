import { describe, expect, it } from "vitest";
import {
  provenanceSequenceExample,
  runProvenanceSequence,
  screenProvenanceOwnershipSequence,
} from "./tool.js";

describe("provenance ownership-event sequence screen", () => {
  it("reproduces the canonical leap-year gap example", () => {
    expect(runProvenanceSequence(provenanceSequenceExample.input)).toEqual({
      ok: true,
      output: provenanceSequenceExample.output,
    });
  });

  it("accepts same-day events", () => {
    expect(
      screenProvenanceOwnershipSequence({
        eventDates: ["2025-01-01", "2025-01-01"],
        maximumAllowedGapDays: 0,
      }),
    ).toMatchObject({
      gapsDays: [0],
      maximumGapDays: 0,
      withinCallerGapLimit: true,
    });
  });

  it("rejects reversed event order", () => {
    expect(
      runProvenanceSequence({
        eventDates: ["2025-01-02", "2025-01-01"],
        maximumAllowedGapDays: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "events_out_of_order", field: "eventDates" }] },
      ok: false,
    });
  });

  it("rejects an invalid date", () => {
    expect(
      runProvenanceSequence({
        eventDates: ["2023-02-29", "2025-01-01"],
        maximumAllowedGapDays: 400,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "date_invalid", field: "eventDates" }] },
      ok: false,
    });
  });

  it("rejects a one-event chain", () => {
    expect(
      runProvenanceSequence({
        eventDates: ["2025-01-01"],
        maximumAllowedGapDays: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "insufficient_events", field: "eventDates" }] },
      ok: false,
    });
  });
});
