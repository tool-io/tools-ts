import { describe, expect, it } from "vitest";
import { runChestGirthWeight } from "./tool.js";

describe("Chest Girth Weight", () => {
  it("estimates weight at one hundred eighty centimetres of girth", () =>
    expect(runChestGirthWeight({ chestGirthCm: 180 })).toEqual({
      ok: true,
      output: { estimatedWeightKg: 490.0840336134454 },
    }));
  it("estimates weight at one hundred centimetres of girth", () =>
    expect(runChestGirthWeight({ chestGirthCm: 100 })).toEqual({
      ok: true,
      output: { estimatedWeightKg: 84.03361344537815 },
    }));
  it("scales with the cube of girth", () => {
    const single = runChestGirthWeight({ chestGirthCm: 90 });
    const double = runChestGirthWeight({ chestGirthCm: 180 });
    expect(single.ok && double.ok).toBe(true);
    if (single.ok && double.ok)
      expect(
        Number(double.output.estimatedWeightKg) /
          Number(single.output.estimatedWeightKg),
      ).toBeCloseTo(8, 12);
  });
  it("rejects zero chest girth", () =>
    expect(runChestGirthWeight({ chestGirthCm: 0 }).ok).toBe(false));
  it("rejects negative chest girth", () =>
    expect(runChestGirthWeight({ chestGirthCm: -1 }).ok).toBe(false));
  it("accepts fractional girth measurements", () =>
    expect(runChestGirthWeight({ chestGirthCm: 179.5 }).ok).toBe(true));
});
