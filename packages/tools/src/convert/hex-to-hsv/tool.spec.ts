import { describe, expect, it } from "vitest";
import { hexToHsvExample, runHexToHsv } from "./tool.js";

describe("HEX to HSV Converter", () => {
  it.each([
    ["#F00", { hue: 0, saturation: 100, value: 100 }],
    ["#00FF00", { hue: 120, saturation: 100, value: 100 }],
    ["#0000FF", { hue: 240, saturation: 100, value: 100 }],
    ["#FFF", { hue: 0, saturation: 0, value: 100 }],
    ["#000", { hue: 0, saturation: 0, value: 0 }],
  ])("converts %s", (hex, output) => {
    expect(runHexToHsv({ hex })).toEqual({ ok: true, output });
  });

  it.each(["", "#12", "#XYZ", "#1234", "#12345678"])(
    "rejects invalid HEX input %s",
    (hex) => expect(runHexToHsv({ hex }).ok).toBe(false),
  );

  it("publishes an executable authored example", () => {
    expect(runHexToHsv(hexToHsvExample.input)).toEqual({
      ok: true,
      output: hexToHsvExample.output,
    });
  });
});
