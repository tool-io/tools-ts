import { describe, expect, it } from "vitest";
import { runActivityCoefficient } from "./tool.js";
describe("Activity Coefficient From Gamma Input", () => {
  it("calculates a valid result", () =>
    expect(runActivityCoefficient({ gamma: 0.9, concentrationM: 0.1 })).toEqual(
      {
        ok: true,
        output: { activity: 0.09000000000000001 },
      },
    ));
  it("accepts zero concentration", () =>
    expect(runActivityCoefficient({ gamma: 0.9, concentrationM: 0 }).ok).toBe(
      true,
    ));
  it("rejects invalid input", () =>
    expect(runActivityCoefficient({ gamma: 0, concentrationM: 0.1 }).ok).toBe(
      false,
    ));
});
