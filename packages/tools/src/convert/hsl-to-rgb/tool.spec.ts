import { describe, expect, it } from "vitest";
import { hslToRgbExample, runHslToRgb } from "./tool.js";

describe("HSL to RGB Converter", () => {
  it.each([
    [
      { hue: 0, saturation: 100, lightness: 50 },
      { red: 255, green: 0, blue: 0 },
    ],
    [
      { hue: 120, saturation: 100, lightness: 50 },
      { red: 0, green: 255, blue: 0 },
    ],
    [
      { hue: 240, saturation: 100, lightness: 50 },
      { red: 0, green: 0, blue: 255 },
    ],
    [
      { hue: 360, saturation: 100, lightness: 50 },
      { red: 255, green: 0, blue: 0 },
    ],
    [
      { hue: 0, saturation: 0, lightness: 0 },
      { red: 0, green: 0, blue: 0 },
    ],
    [
      { hue: 0, saturation: 0, lightness: 100 },
      { red: 255, green: 255, blue: 255 },
    ],
  ])("converts HSL channels", (input, output) => {
    expect(runHslToRgb(input)).toEqual({ ok: true, output });
  });

  it.each([
    { hue: -1, saturation: 100, lightness: 50 },
    { hue: 361, saturation: 100, lightness: 50 },
    { hue: 0, saturation: 101, lightness: 50 },
    { hue: 0, saturation: 100, lightness: Number.POSITIVE_INFINITY },
  ])("rejects invalid HSL channels", (input) => {
    expect(runHslToRgb(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runHslToRgb(hslToRgbExample.input)).toEqual({
      ok: true,
      output: hslToRgbExample.output,
    });
  });
});
