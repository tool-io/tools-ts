import { describe, expect, it } from "vitest";
import { runBodyLengthWeight } from "./tool.js";

describe("Body Length Weight", () => {
  it("estimates a typical animal at length one hundred sixty and girth one hundred ninety", () =>
    expect(
      runBodyLengthWeight({ bodyLengthCm: 160, chestGirthCm: 190 }),
    ).toEqual({
      ok: true,
      output: { estimatedWeightKg: 532.9396567632405 },
    }));
  it("estimates weight at length and girth of one hundred twenty", () =>
    expect(
      runBodyLengthWeight({ bodyLengthCm: 120, chestGirthCm: 120 }),
    ).toEqual({
      ok: true,
      output: { estimatedWeightKg: 159.43901088761766 },
    }));
  it("scales linearly with body length", () => {
    const single = runBodyLengthWeight({ bodyLengthCm: 80, chestGirthCm: 190 });
    const double = runBodyLengthWeight({
      bodyLengthCm: 160,
      chestGirthCm: 190,
    });
    expect(single.ok && double.ok).toBe(true);
    if (single.ok && double.ok)
      expect(
        Number(double.output.estimatedWeightKg) /
          Number(single.output.estimatedWeightKg),
      ).toBeCloseTo(2, 12);
  });
  it("rejects zero body length", () =>
    expect(runBodyLengthWeight({ bodyLengthCm: 0, chestGirthCm: 190 }).ok).toBe(
      false,
    ));
  it("rejects zero chest girth", () =>
    expect(runBodyLengthWeight({ bodyLengthCm: 160, chestGirthCm: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative inputs", () =>
    expect(
      runBodyLengthWeight({ bodyLengthCm: -160, chestGirthCm: 190 }).ok,
    ).toBe(false));
});
