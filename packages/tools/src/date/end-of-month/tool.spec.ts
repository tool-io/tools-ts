import { describe, expect, it } from "vitest";
import { runEndOfMonth } from "./tool.js";

describe("End of Month Tool", () => {
  it("calculates a valid result", () => {
    expect(runEndOfMonth({ date: "2024-02-05" })).toEqual({
      ok: true,
      output: { date: "2024-02-29" },
    });
    expect(runEndOfMonth({ date: "2023-02-05" })).toEqual({
      ok: true,
      output: { date: "2023-02-28" },
    });
    expect(runEndOfMonth({ date: "2024-04-19" })).toEqual({
      ok: true,
      output: { date: "2024-04-30" },
    });
  });

  it("rejects invalid input", () => expect(runEndOfMonth(null).ok).toBe(false));
});
