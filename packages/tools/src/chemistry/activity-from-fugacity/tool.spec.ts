import { describe, expect, it } from "vitest";
import { runActivityFromFugacity } from "./tool.js";
describe("Activity From Fugacity", () => {
  it("calculates a valid result", () =>
    expect(runActivityFromFugacity({ fugacityBar: 2.5 })).toEqual({
      ok: true,
      output: { thermodynamicActivity: 2.5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runActivityFromFugacity({
        fugacityBar: 2.5,
        standardPressureBar: 0,
      }).ok,
    ).toBe(false));
});
