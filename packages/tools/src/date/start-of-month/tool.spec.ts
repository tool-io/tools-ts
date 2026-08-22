import { describe, expect, it } from "vitest";
import { runStartOfMonth } from "./tool.js";

describe("Start of Month Tool", () => {
  it("calculates a valid result", () => {
    expect(runStartOfMonth({ date: "2024-03-19" })).toEqual({
      ok: true,
      output: { date: "2024-03-01" },
    });
    expect(runStartOfMonth({ date: "2024-03-01" })).toEqual({
      ok: true,
      output: { date: "2024-03-01" },
    });
  });

  it("rejects invalid input", () =>
    expect(runStartOfMonth(null).ok).toBe(false));
});
