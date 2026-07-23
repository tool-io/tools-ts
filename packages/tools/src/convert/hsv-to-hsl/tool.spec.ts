import { describe, expect, it } from "vitest";
import { hsvToHslExample, runHsvToHsl } from "./tool.js";

describe("HSV to HSL Converter", () => {
  it.each([
    [
      { hue: 0, saturation: 100, value: 100 },
      { hue: 0, saturation: 100, lightness: 50 },
    ],
    [
      { hue: 120, saturation: 100, value: 100 },
      { hue: 120, saturation: 100, lightness: 50 },
    ],
    [
      { hue: 360, saturation: 100, value: 100 },
      { hue: 0, saturation: 100, lightness: 50 },
    ],
    [
      { hue: 0, saturation: 0, value: 0 },
      { hue: 0, saturation: 0, lightness: 0 },
    ],
    [
      { hue: 0, saturation: 0, value: 100 },
      { hue: 0, saturation: 0, lightness: 100 },
    ],
  ])("converts HSV channels", (input, output) => {
    expect(runHsvToHsl(input)).toEqual({ ok: true, output });
  });

  it.each([
    { hue: -1, saturation: 100, value: 100 },
    { hue: 361, saturation: 100, value: 100 },
    { hue: 0, saturation: 101, value: 100 },
    { hue: 0, saturation: 100, value: Number.NaN },
  ])("rejects invalid HSV channels", (input) => {
    expect(runHsvToHsl(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runHsvToHsl(hsvToHslExample.input)).toEqual({
      ok: true,
      output: hsvToHslExample.output,
    });
  });
});
