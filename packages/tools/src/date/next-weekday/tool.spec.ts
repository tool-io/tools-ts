import { describe, expect, it } from "vitest";
import { runNextWeekday } from "./tool.js";

describe("Next Weekday Finder", () => {
  it("calculates a valid result", () => {
    expect(runNextWeekday({ date: "2024-01-05", weekday: 1 })).toEqual({
      ok: true,
      output: { date: "2024-01-08" },
    });
  });

  it("always moves strictly forward", () => {
    expect(runNextWeekday({ date: "2024-01-08", weekday: 1 })).toEqual({
      ok: true,
      output: { date: "2024-01-15" },
    });
  });

  it("wraps across month boundaries", () => {
    expect(runNextWeekday({ date: "2024-01-31", weekday: 4 })).toEqual({
      ok: true,
      output: { date: "2024-02-01" },
    });
  });

  it("rejects invalid input", () =>
    expect(runNextWeekday(null).ok).toBe(false));
});
