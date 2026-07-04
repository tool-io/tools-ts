import { describe, expect, it } from "vitest";
import { runCurrent } from "./tool.js";
describe("Electrical Current Calculator", () => {
  it("calculates a valid result", () => {
    expect(runCurrent({ voltage: 12, resistance: 4 })).toEqual({
      ok: true,
      output: { current: 3 },
    });
  });
  it("rejects invalid input", () => expect(runCurrent(null).ok).toBe(false));
});
