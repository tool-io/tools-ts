import { describe, expect, it } from "vitest";
import { runIsLeapDay } from "./tool.js";

describe("Is Leap Day Checker", () => {
  it("calculates a valid result", () => {
    expect(runIsLeapDay({ date: "2024-02-29" })).toEqual({
      ok: true,
      output: { leapDay: true },
    });
    expect(runIsLeapDay({ date: "2023-02-28" })).toEqual({
      ok: true,
      output: { leapDay: false },
    });
    expect(runIsLeapDay({ date: "2024-02-28" })).toEqual({
      ok: true,
      output: { leapDay: false },
    });
  });

  it("rejects invalid input", () => expect(runIsLeapDay(null).ok).toBe(false));
});
