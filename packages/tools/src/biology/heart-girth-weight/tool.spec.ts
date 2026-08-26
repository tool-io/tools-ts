import { describe, expect, it } from "vitest";
import { runHeartGirthWeight } from "./tool.js";

describe("Heart Girth Weight Estimate", () => {
  it("estimates a typical cow at girth one hundred ninety and length one hundred sixty", () =>
    expect(runHeartGirthWeight({ bodyLengthCm: 160, girthCm: 190 })).toEqual({
      ok: true,
      output: { estimatedWeightKg: 532.8904880524034 },
    }));
  it("estimates unit dimensions symmetrically", () =>
    expect(runHeartGirthWeight({ bodyLengthCm: 100, girthCm: 100 })).toEqual({
      ok: true,
      output: { estimatedWeightKg: 92.25943352707814 },
    }));
  it("scales linearly with body length", () => {
    const single = runHeartGirthWeight({ bodyLengthCm: 80, girthCm: 190 });
    const double = runHeartGirthWeight({ bodyLengthCm: 160, girthCm: 190 });
    expect(single.ok && double.ok).toBe(true);
    if (single.ok && double.ok)
      expect(
        Number(double.output.estimatedWeightKg) /
          Number(single.output.estimatedWeightKg),
      ).toBeCloseTo(2, 12);
  });
  it("rejects zero girth", () =>
    expect(runHeartGirthWeight({ bodyLengthCm: 160, girthCm: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative girth", () =>
    expect(runHeartGirthWeight({ bodyLengthCm: 160, girthCm: -190 }).ok).toBe(
      false,
    ));
  it("rejects negative body length", () =>
    expect(runHeartGirthWeight({ bodyLengthCm: -5, girthCm: 190 }).ok).toBe(
      false,
    ));
});
