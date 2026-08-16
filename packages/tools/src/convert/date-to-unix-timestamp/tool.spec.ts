import { describe, expect, it } from "vitest";
import {
  calculateDateToUnixTimestamp,
  dateToUnixTimestampExample,
  runDateToUnixTimestamp,
} from "./tool.js";

describe("date to unix timestamp converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDateToUnixTimestamp(dateToUnixTimestampExample.input)).toEqual({
      ok: true,
      output: dateToUnixTimestampExample.output,
    });
  });

  it("converts a date with time and knows leap days", () => {
    expect(
      calculateDateToUnixTimestamp({
        date: "2026-08-17",
        time: "12:30:45",
      }),
    ).toMatchObject({ unixSeconds: 1786969845 });
    // 2024-02-29 exists; the day after is March 1.
    expect(
      calculateDateToUnixTimestamp({ date: "2024-03-01" }).unixSeconds % 86_400,
    ).toBe(0);
  });

  it("rejects invalid dates and times through execution", () => {
    expect(runDateToUnixTimestamp({ date: "2023-02-29" }).ok).toBe(false);
    expect(
      runDateToUnixTimestamp({ date: "2026-08-17", time: "24:00:00" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_time" }] },
      ok: false,
    });
  });
});
