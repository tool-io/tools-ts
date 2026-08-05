import { describe, expect, it } from "vitest";
import { convertRgbToOklch, rgbToOklchExample, runRgbToOklch } from "./tool.js";

describe("RGB to OKLCH Converter", () => {
  it("converts the canonical example", () =>
    expect(convertRgbToOklch(rgbToOklchExample.input)).toEqual(
      rgbToOklchExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runRgbToOklch(rgbToOklchExample.input)).toEqual({
      ok: true,
      output: rgbToOklchExample.output,
    }));
});
