import { describe, expect, it } from "vitest";
import { convertHsvToOklch, hsvToOklchExample, runHsvToOklch } from "./tool.js";

describe("HSV to OKLCH Converter", () => {
  it("converts the canonical example", () =>
    expect(convertHsvToOklch(hsvToOklchExample.input)).toEqual(
      hsvToOklchExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runHsvToOklch(hsvToOklchExample.input)).toEqual({
      ok: true,
      output: hsvToOklchExample.output,
    }));
});
