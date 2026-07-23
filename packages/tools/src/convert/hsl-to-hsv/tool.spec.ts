import { describe, expect, it } from "vitest";
import { hslToHsvExample, runHslToHsv } from "./tool.js";

describe("HSL to HSV Converter", () => {
  it.each([
    [
      { hue: 0, saturation: 100, lightness: 50 },
      { hue: 0, saturation: 100, value: 100 },
    ],
    [
      { hue: 120, saturation: 100, lightness: 50 },
      { hue: 120, saturation: 100, value: 100 },
    ],
    [
      { hue: 360, saturation: 100, lightness: 50 },
      { hue: 0, saturation: 100, value: 100 },
    ],
    [
      { hue: 0, saturation: 0, lightness: 0 },
      { hue: 0, saturation: 0, value: 0 },
    ],
    [
      { hue: 0, saturation: 0, lightness: 100 },
      { hue: 0, saturation: 0, value: 100 },
    ],
  ])("converts HSL channels", (input, output) => {
    expect(runHslToHsv(input)).toEqual({ ok: true, output });
  });

  it.each([
    { hue: -1, saturation: 100, lightness: 50 },
    { hue: 361, saturation: 100, lightness: 50 },
    { hue: 0, saturation: -1, lightness: 50 },
    { hue: 0, saturation: 100, lightness: 101 },
  ])("rejects invalid HSL channels", (input) => {
    expect(runHslToHsv(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runHslToHsv(hslToHsvExample.input)).toEqual({
      ok: true,
      output: hslToHsvExample.output,
    });
  });
});
