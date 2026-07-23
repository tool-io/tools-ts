import { describe, expect, it } from "vitest";
import { hsvToHexExample, runHsvToHex } from "./tool.js";

describe("HSV to HEX Converter", () => {
  it.each([
    [{ hue: 0, saturation: 100, value: 100 }, "#FF0000"],
    [{ hue: 120, saturation: 100, value: 100 }, "#00FF00"],
    [{ hue: 240, saturation: 100, value: 100 }, "#0000FF"],
    [{ hue: 360, saturation: 100, value: 100 }, "#FF0000"],
    [{ hue: 0, saturation: 0, value: 0 }, "#000000"],
    [{ hue: 0, saturation: 0, value: 100 }, "#FFFFFF"],
  ])("converts HSV channels", (input, hex) => {
    expect(runHsvToHex(input)).toEqual({ ok: true, output: { hex } });
  });

  it.each([
    { hue: -1, saturation: 100, value: 100 },
    { hue: 361, saturation: 100, value: 100 },
    { hue: 0, saturation: -1, value: 100 },
    { hue: 0, saturation: 100, value: 101 },
  ])("rejects invalid HSV channels", (input) => {
    expect(runHsvToHex(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runHsvToHex(hsvToHexExample.input)).toEqual({
      ok: true,
      output: hsvToHexExample.output,
    });
  });
});
