import { describe, expect, it } from "vitest";
import { hexToRgbExample, runHexToRgb } from "./tool.js";

describe("HEX to RGB Converter", () => {
  it.each([
    ["#000", { blue: 0, green: 0, red: 0 }],
    ["fff", { blue: 255, green: 255, red: 255 }],
    ["#FF0000", { blue: 0, green: 0, red: 255 }],
    ["#00ff00", { blue: 0, green: 255, red: 0 }],
    ["#46465A", { blue: 90, green: 70, red: 70 }],
  ])("converts %s", (hex, output) => {
    expect(runHexToRgb({ hex })).toEqual({ ok: true, output });
  });

  it.each(["", "#12", "#GGG", "#1234", "#12345678"])(
    "rejects invalid HEX input %s",
    (hex) => expect(runHexToRgb({ hex }).ok).toBe(false),
  );

  it("publishes an executable authored example", () => {
    expect(runHexToRgb(hexToRgbExample.input)).toEqual({
      ok: true,
      output: hexToRgbExample.output,
    });
  });
});
