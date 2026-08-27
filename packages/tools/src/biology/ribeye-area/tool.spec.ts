import { describe, expect, it } from "vitest";
import { runRibeyeArea } from "./tool.js";

describe("Ribeye Area Ellipse", () => {
  it("computes area for width ten and height fifteen", () =>
    expect(runRibeyeArea({ heightCm: 15, widthCm: 10 })).toEqual({
      ok: true,
      output: { ribeyeAreaCm2: 117.80972450961724 },
    }));
  it("computes area for width fourteen and height twenty", () =>
    expect(runRibeyeArea({ heightCm: 20, widthCm: 14 })).toEqual({
      ok: true,
      output: { ribeyeAreaCm2: 219.9114857512855 },
    }));
  it("matches the circle area for equal width and height", () => {
    const result = runRibeyeArea({ heightCm: 20, widthCm: 20 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.ribeyeAreaCm2).toBeCloseTo(Math.PI * 100, 12);
  });
  it("scales linearly with each dimension", () => {
    const single = runRibeyeArea({ heightCm: 15, widthCm: 10 });
    const doubled = runRibeyeArea({ heightCm: 30, widthCm: 10 });
    expect(single.ok && doubled.ok).toBe(true);
    if (single.ok && doubled.ok)
      expect(
        Number(doubled.output.ribeyeAreaCm2) /
          Number(single.output.ribeyeAreaCm2),
      ).toBeCloseTo(2, 12);
  });
  it("rejects zero width", () =>
    expect(runRibeyeArea({ heightCm: 15, widthCm: 0 }).ok).toBe(false));
  it("rejects negative height", () =>
    expect(runRibeyeArea({ heightCm: -3, widthCm: 10 }).ok).toBe(false));
});
