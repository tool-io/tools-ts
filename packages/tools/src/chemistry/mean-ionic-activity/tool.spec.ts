import { describe, expect, it } from "vitest";
import { runMeanIonicActivity } from "./tool.js";
describe("Mean Ionic Activity", () => {
  it("calculates a valid result", () =>
    expect(runMeanIonicActivity({ gammaPlus: 0.9, gammaMinus: 0.8 })).toEqual({
      ok: true,
      output: { meanActivityCoefficient: 0.8485281374238571 },
    }));
  it("rejects invalid input", () =>
    expect(runMeanIonicActivity({ gammaPlus: -0.9, gammaMinus: 0.8 }).ok).toBe(
      false,
    ));
});
