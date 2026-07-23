import { describe, expect, it } from "vitest";
import { rgbToHexExample, runRgbToHex } from "./tool.js";

describe("RGB to HEX Converter", () => {
  it.each([
    [{ red: 0, green: 0, blue: 0 }, "#000000"],
    [{ red: 255, green: 255, blue: 255 }, "#FFFFFF"],
    [{ red: 255, green: 0, blue: 0 }, "#FF0000"],
    [{ red: 0, green: 255, blue: 0 }, "#00FF00"],
    [{ red: 15.5, green: 0, blue: 255 }, "#1000FF"],
  ])("converts RGB channels", (input, hex) => {
    expect(runRgbToHex(input)).toEqual({ ok: true, output: { hex } });
  });

  it.each([
    { red: -1, green: 0, blue: 0 },
    { red: 256, green: 0, blue: 0 },
    { red: Number.NaN, green: 0, blue: 0 },
    { red: Number.POSITIVE_INFINITY, green: 0, blue: 0 },
  ])("rejects invalid RGB channels", (input) => {
    expect(runRgbToHex(input).ok).toBe(false);
  });

  it("publishes an executable authored example", () => {
    expect(runRgbToHex(rgbToHexExample.input)).toEqual({
      ok: true,
      output: rgbToHexExample.output,
    });
  });
});
