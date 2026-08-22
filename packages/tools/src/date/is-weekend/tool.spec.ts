import { describe, expect, it } from "vitest";
import { runIsWeekend } from "./tool.js";

describe("Is Weekend Checker", () => {
  it("calculates a valid result", () => {
    expect(runIsWeekend({ date: "2024-01-06" })).toEqual({
      ok: true,
      output: { weekend: true },
    });
    expect(runIsWeekend({ date: "2024-01-07" })).toEqual({
      ok: true,
      output: { weekend: true },
    });
    expect(runIsWeekend({ date: "2024-01-05" })).toEqual({
      ok: true,
      output: { weekend: false },
    });
  });

  it("rejects invalid input", () => expect(runIsWeekend(null).ok).toBe(false));
});
