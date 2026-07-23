import { describe, expect, it } from "vitest";
import { rgbToHslExample, runRgbToHsl } from "./tool.js";

describe("RGB to HSL Converter", () => {
  it.each([
    [
      { red: 255, green: 0, blue: 0 },
      { hue: 0, saturation: 100, lightness: 50 },
    ],
    [
      { red: 0, green: 255, blue: 0 },
      { hue: 120, saturation: 100, lightness: 50 },
    ],
    [
      { red: 0, green: 0, blue: 255 },
      { hue: 240, saturation: 100, lightness: 50 },
    ],
    [
      { red: 255, green: 255, blue: 255 },
      { hue: 0, saturation: 0, lightness: 100 },
    ],
    [
      { red: 0, green: 0, blue: 0 },
      { hue: 0, saturation: 0, lightness: 0 },
    ],
    [
      { red: 128, green: 128, blue: 128 },
      { hue: 0, saturation: 0, lightness: 50.2 },
    ],
  ])("converts RGB channels", (input, output) => {
    expect(runRgbToHsl(input)).toEqual({ ok: true, output });
  });

  it.each([
    { red: -1, green: 0, blue: 0 },
    { red: 256, green: 0, blue: 0 },
    { red: Number.NaN, green: 0, blue: 0 },
    { red: Number.POSITIVE_INFINITY, green: 0, blue: 0 },
  ])("rejects invalid RGB channels", (input) => {
    expect(runRgbToHsl(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runRgbToHsl(rgbToHslExample.input)).toEqual({
      ok: true,
      output: rgbToHslExample.output,
    });
  });
});
