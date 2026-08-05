import { describe, expect, it } from "vitest";
import { convertOklchToHsv, oklchToHsvExample, runOklchToHsv } from "./tool.js";

describe("OKLCH to HSV Converter", () => {
  it("converts the canonical example", () =>
    expect(convertOklchToHsv(oklchToHsvExample.input)).toEqual(
      oklchToHsvExample.output,
    ));
  it("publishes an executable example", () =>
    expect(runOklchToHsv(oklchToHsvExample.input)).toEqual({
      ok: true,
      output: oklchToHsvExample.output,
    }));
});
