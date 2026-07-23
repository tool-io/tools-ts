import { describe, expect, it } from "vitest";
import { hexToHslExample, runHexToHsl } from "./tool.js";

describe("HEX to HSL Converter", () => {
  it.each([
    ["#F00", { hue: 0, lightness: 50, saturation: 100 }],
    ["#00FF00", { hue: 120, lightness: 50, saturation: 100 }],
    ["#0000FF", { hue: 240, lightness: 50, saturation: 100 }],
    ["#FFF", { hue: 0, lightness: 100, saturation: 0 }],
    ["#000", { hue: 0, lightness: 0, saturation: 0 }],
  ])("converts %s", (hex, output) => {
    expect(runHexToHsl({ hex })).toEqual({ ok: true, output });
  });

  it.each(["", "#12", "#XYZ", "#1234", "#12345678"])(
    "rejects invalid HEX input %s",
    (hex) => expect(runHexToHsl({ hex }).ok).toBe(false),
  );

  it("publishes an executable authored example", () => {
    expect(runHexToHsl(hexToHslExample.input)).toEqual({
      ok: true,
      output: hexToHslExample.output,
    });
  });
});
