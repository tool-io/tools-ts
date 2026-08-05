import { describe, expect, it } from "vitest";
import {
  convertLuminousFlux,
  luminousFluxExample,
  runLuminousFlux,
} from "./tool.js";

describe("Convert Luminous Flux", () => {
  it("converts the canonical example", () =>
    expect(
      convertLuminousFlux(
        luminousFluxExample.input.value,
        luminousFluxExample.input.fromUnit,
        luminousFluxExample.input.toUnit,
      ),
    ).toBeCloseTo(luminousFluxExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertLuminousFlux(3, "lm", "lm")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertLuminousFlux(1, "unknown", "lm")).toBeNull();
    expect(convertLuminousFlux(Number.NaN, "lm", "lm")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runLuminousFlux(luminousFluxExample.input)).toEqual({
      ok: true,
      output: luminousFluxExample.output,
    }));
});
