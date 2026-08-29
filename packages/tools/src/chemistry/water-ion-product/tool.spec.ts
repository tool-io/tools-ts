import { describe, expect, it } from "vitest";
import { runWaterIonProduct } from "./tool.js";

describe("Water Ion Product Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runWaterIonProduct({
        hConcentrationMolL: 1e-7,
        ohConcentrationMolL: 1e-7,
      }),
    ).toEqual({
      ok: true,
      output: { kw: expect.closeTo(1e-14, 20) },
    });
  });

  it("rejects invalid input", () =>
    expect(runWaterIonProduct(null).ok).toBe(false));
});
