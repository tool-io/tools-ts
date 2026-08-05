import { describe, expect, it } from "vitest";
import { oklchToRgb, rgbToOklch } from "./oklch.js";

describe("OKLCH conversion core", () => {
  it("converts the Tool.io example color", () => {
    const oklch = rgbToOklch({ blue: 90, green: 70, red: 70 });
    expect(oklch?.lightness).toBeCloseTo(40.224337, 5);
    expect(oklch?.chroma).toBeCloseTo(0.033435, 5);
    expect(oklch?.hue).toBeCloseTo(284.798216, 5);
  });
  it("converts OKLCH back to clipped 8-bit sRGB", () =>
    expect(
      oklchToRgb({ chroma: 0.033435, hue: 284.798216, lightness: 40.224337 }),
    ).toEqual({ blue: 90, green: 70, red: 70 }));
  it("rejects invalid channels and components", () => {
    expect(rgbToOklch({ blue: 0, green: 0, red: 256 })).toBeNull();
    expect(oklchToRgb({ chroma: -1, hue: 0, lightness: 50 })).toBeNull();
  });
});
