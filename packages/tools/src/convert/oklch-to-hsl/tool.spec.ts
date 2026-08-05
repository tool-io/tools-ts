import { describe, expect, it } from "vitest";
import { convertOklchToHsl, oklchToHslExample, runOklchToHsl } from "./tool.js";

describe("OKLCH to HSL Converter", () => {
  it("converts the canonical example", () =>
    expect(convertOklchToHsl(oklchToHslExample.input)).toEqual(
      oklchToHslExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runOklchToHsl(oklchToHslExample.input)).toEqual({
      ok: true,
      output: oklchToHslExample.output,
    }));
});
