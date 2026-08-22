import { describe, expect, it } from "vitest";
import { runIsoWeekYear } from "./tool.js";

describe("ISO Week Year Calculator", () => {
  it("calculates a valid result", () => {
    expect(runIsoWeekYear({ date: "2026-08-17" })).toEqual({
      ok: true,
      output: { isoWeekYear: 2026 },
    });
  });

  it("assigns boundary days to the owning week year", () => {
    expect(runIsoWeekYear({ date: "2024-12-30" })).toEqual({
      ok: true,
      output: { isoWeekYear: 2025 },
    });
    expect(runIsoWeekYear({ date: "2021-01-01" })).toEqual({
      ok: true,
      output: { isoWeekYear: 2020 },
    });
  });

  it("rejects invalid input", () =>
    expect(runIsoWeekYear(null).ok).toBe(false));
});
