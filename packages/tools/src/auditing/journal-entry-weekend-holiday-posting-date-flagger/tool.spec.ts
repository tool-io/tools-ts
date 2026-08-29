import { describe, expect, it } from "vitest";
import {
  flagJournalEntryDates,
  journalEntryDateFlagExample,
  runJournalEntryDateFlag,
} from "./tool.js";

describe("journal entry weekend holiday posting date flagger", () => {
  it("reproduces its canonical example", () => {
    expect(runJournalEntryDateFlag(journalEntryDateFlagExample.input)).toEqual({
      ok: true,
      output: journalEntryDateFlagExample.output,
    });
  });

  it("prefers the holiday reason when both apply", () => {
    // 2026-01-03 is a Saturday and also listed as a holiday.
    expect(
      flagJournalEntryDates({
        entries: [{ date: "2026-01-03" }],
        holidays: ["2026-01-03"],
        weekend: ["saturday"],
      }).flagged,
    ).toEqual([{ index: 0, reason: "holiday" }]);
  });

  it("does not flag weekdays when the weekend list is empty", () => {
    expect(
      flagJournalEntryDates({
        entries: [{ date: "2026-01-03" }],
        holidays: [],
        weekend: [],
      }),
    ).toEqual({ flagged: [], flaggedCount: 0 });
  });

  it("keeps input order and indices across mixed reasons", () => {
    expect(
      flagJournalEntryDates({
        entries: [
          { date: "2026-01-04" },
          { date: "2026-01-05" },
          { date: "2026-01-10" },
        ],
        holidays: [],
        weekend: ["saturday", "sunday"],
      }).flagged.map((entry) => entry.index),
    ).toEqual([0, 2]);
  });

  it("maps Sunday and Monday to their correct UTC weekdays", () => {
    expect(
      flagJournalEntryDates({
        entries: [{ date: "2026-01-04" }, { date: "2026-01-05" }],
        holidays: [],
        weekend: ["sunday"],
      }).flagged,
    ).toEqual([{ index: 0, reason: "weekend" }]);
  });

  it("rejects an unknown weekend day name", () => {
    expect(
      runJournalEntryDateFlag({
        entries: [{ date: "2026-01-05" }],
        holidays: [],
        weekend: ["funday"],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_weekday", field: "weekend.0" }] },
      ok: false,
    });
  });

  it("rejects a malformed entry date", () => {
    expect(
      runJournalEntryDateFlag({
        entries: [{ date: "not-a-date" }],
        holidays: [],
        weekend: ["sunday"],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_entry_date", field: "entries.0.date" }],
      },
      ok: false,
    });
  });
});
