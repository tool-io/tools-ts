import { describe, expect, it } from "vitest";
import { hslToHexExample, runHslToHex } from "./tool.js";

describe("HSL to HEX Converter", () => {
  it.each([
    [{ hue: 0, saturation: 100, lightness: 50 }, "#FF0000"],
    [{ hue: 120, saturation: 100, lightness: 50 }, "#00FF00"],
    [{ hue: 240, saturation: 100, lightness: 50 }, "#0000FF"],
    [{ hue: 360, saturation: 100, lightness: 50 }, "#FF0000"],
    [{ hue: 0, saturation: 0, lightness: 0 }, "#000000"],
    [{ hue: 0, saturation: 0, lightness: 100 }, "#FFFFFF"],
  ])("converts HSL channels", (input, hex) => {
    expect(runHslToHex(input)).toEqual({ ok: true, output: { hex } });
  });

  it.each([
    { hue: -1, saturation: 100, lightness: 50 },
    { hue: 361, saturation: 100, lightness: 50 },
    { hue: 0, saturation: 101, lightness: 50 },
    { hue: 0, saturation: 100, lightness: Number.NaN },
  ])("rejects invalid HSL channels", (input) => {
    expect(runHslToHex(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runHslToHex(hslToHexExample.input)).toEqual({
      ok: true,
      output: hslToHexExample.output,
    });
  });
});
