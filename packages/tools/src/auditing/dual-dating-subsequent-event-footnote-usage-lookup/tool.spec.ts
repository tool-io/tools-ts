import { describe, expect, it } from "vitest";
import {
  classifySubsequentEventDates,
  runSubsequentEventDate,
  subsequentEventDateExample,
} from "./tool.js";

describe("dual dating subsequent event usage", () => {
  it("reproduces its canonical example", () => {
    expect(runSubsequentEventDate(subsequentEventDateExample.input)).toEqual({
      ok: true,
      output: subsequentEventDateExample.output,
    });
  });

  it("requires notes for a nonadjusting event", () => {
    expect(
      classifySubsequentEventDates({
        dualDated: false,
        eventDate: "2026-02-01",
        eventType: "nonadjusting_subsequent",
        financialStatementDate: "2026-01-31",
        notesDisclosed: false,
      }),
    ).toMatchObject({ disclosureSatisfied: false, dualDateRequired: false });
  });

  it("flags a missing dual date for an adjusting event", () => {
    expect(
      classifySubsequentEventDates({
        dualDated: false,
        eventDate: "2026-02-01",
        eventType: "adjusting_subsequent",
        financialStatementDate: "2026-01-31",
        notesDisclosed: false,
      }).dualDateSatisfied,
    ).toBe(false);
  });

  it("rejects a reversed event chronology", () => {
    expect(
      classifySubsequentEventDates({
        dualDated: false,
        eventDate: "2026-01-01",
        eventType: "recognized_subsequent",
        financialStatementDate: "2026-01-31",
        notesDisclosed: true,
      }).chronologyValid,
    ).toBe(false);
  });
});
