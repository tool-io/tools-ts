import { describe, expect, it } from "vitest";
import { convertHslToOklch, hslToOklchExample, runHslToOklch } from "./tool.js";

describe("HSL to OKLCH Converter", () => {
  it("converts the canonical example", () =>
    expect(convertHslToOklch(hslToOklchExample.input)).toEqual(
      hslToOklchExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runHslToOklch(hslToOklchExample.input)).toEqual({
      ok: true,
      output: hslToOklchExample.output,
    }));
});
