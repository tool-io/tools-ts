import { describe, expect, it } from "vitest";
import { runVoltage } from "./tool.js";
describe("Electrical Voltage Calculator", () => {
  it("calculates a valid result", () => {
    expect(runVoltage({ current: 3, resistance: 4 })).toEqual({
      ok: true,
      output: { voltage: 12 },
    });
  });
  it("rejects invalid input", () => expect(runVoltage(null).ok).toBe(false));
});
