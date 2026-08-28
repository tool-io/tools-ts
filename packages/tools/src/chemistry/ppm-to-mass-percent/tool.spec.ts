import { describe, expect, it } from "vitest";
import { runPpmToMassPercent } from "./tool.js";

describe("PPM to Mass Percent Converter", () => {
  it("calculates a valid result", () => {
    expect(runPpmToMassPercent({ ppm: 50_000 })).toEqual({
      ok: true,
      output: { percent: 5 },
    });
  });

  it("rejects invalid input", () =>
    expect(runPpmToMassPercent(null).ok).toBe(false));
});
