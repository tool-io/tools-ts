import { describe, expect, it } from "vitest";
import { runPowerFromWork } from "./tool.js";

describe("Power From Work Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPowerFromWork({ seconds: 5, workJoules: 500 })).toEqual({
      ok: true,
      output: { watts: 100 },
    });
  });

  it("rejects non-positive time through execution", () => {
    expect(runPowerFromWork({ seconds: 0, workJoules: 10 })).toMatchObject({
      error: { issues: [{ code: "invalid_time" }] },
      ok: false,
    });
  });

  it("rejects invalid input", () =>
    expect(runPowerFromWork(null).ok).toBe(false));
});
