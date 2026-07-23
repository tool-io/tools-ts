import { describe, expect, it } from "vitest";
import { hsvToRgbExample, runHsvToRgb } from "./tool.js";

describe("HSV to RGB Converter", () => {
  it.each([
    [
      { hue: 0, saturation: 100, value: 100 },
      { red: 255, green: 0, blue: 0 },
    ],
    [
      { hue: 120, saturation: 100, value: 100 },
      { red: 0, green: 255, blue: 0 },
    ],
    [
      { hue: 240, saturation: 100, value: 100 },
      { red: 0, green: 0, blue: 255 },
    ],
    [
      { hue: 360, saturation: 100, value: 100 },
      { red: 255, green: 0, blue: 0 },
    ],
    [
      { hue: 0, saturation: 0, value: 0 },
      { red: 0, green: 0, blue: 0 },
    ],
    [
      { hue: 0, saturation: 0, value: 100 },
      { red: 255, green: 255, blue: 255 },
    ],
  ])("converts HSV channels", (input, output) => {
    expect(runHsvToRgb(input)).toEqual({ ok: true, output });
  });

  it.each([
    { hue: -1, saturation: 100, value: 100 },
    { hue: 361, saturation: 100, value: 100 },
    { hue: 0, saturation: 101, value: 100 },
    { hue: 0, saturation: 100, value: Number.POSITIVE_INFINITY },
  ])("rejects invalid HSV channels", (input) => {
    expect(runHsvToRgb(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runHsvToRgb(hsvToRgbExample.input)).toEqual({
      ok: true,
      output: hsvToRgbExample.output,
    });
  });
});
