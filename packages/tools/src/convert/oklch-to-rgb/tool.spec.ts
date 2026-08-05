import { describe, expect, it } from "vitest";
import { convertOklchToRgb, oklchToRgbExample, runOklchToRgb } from "./tool.js";

describe("OKLCH to RGB Converter", () => {
  it("converts the canonical example", () =>
    expect(convertOklchToRgb(oklchToRgbExample.input)).toEqual(
      oklchToRgbExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runOklchToRgb(oklchToRgbExample.input)).toEqual({
      ok: true,
      output: oklchToRgbExample.output,
    }));
});
