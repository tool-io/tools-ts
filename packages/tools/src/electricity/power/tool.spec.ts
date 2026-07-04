import { describe, expect, it } from "vitest";
import { runPower } from "./tool.js";
describe("Electrical Power Calculator", () => {
  it("calculates a valid result", () => {
    expect(runPower({ voltage: 12, current: 3 })).toEqual({
      ok: true,
      output: { power: 36 },
    });
  });
  it("rejects invalid input", () => expect(runPower(null).ok).toBe(false));
});
