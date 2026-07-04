import { describe, expect, it } from "vitest";
import { runResistance } from "./tool.js";
describe("Electrical Resistance Calculator", () => {
  it("calculates a valid result", () => {
    expect(runResistance({ voltage: 12, current: 3 })).toEqual({
      ok: true,
      output: { resistance: 4 },
    });
  });
  it("rejects invalid input", () => expect(runResistance(null).ok).toBe(false));
});
