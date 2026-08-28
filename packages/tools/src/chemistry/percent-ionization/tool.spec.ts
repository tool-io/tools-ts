import { describe, expect, it } from "vitest";
import { runPercentIonization } from "./tool.js";

describe("Percent Ionization Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runPercentIonization({
        hConcentrationMolL: 0.0133,
        initialConcentrationMolL: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { percentIonization: expect.closeTo(13.3, 9) },
    });
  });

  it("rejects invalid input", () =>
    expect(runPercentIonization(null).ok).toBe(false));
});
