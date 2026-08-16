import { describe, expect, it } from "vitest";
import {
  alphaCompositingExample,
  calculateAlphaCompositing,
  runAlphaCompositing,
} from "./tool.js";

describe("alpha compositing calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAlphaCompositing(alphaCompositingExample.input)).toEqual({
      ok: true,
      output: alphaCompositingExample.output,
    });
  });

  it("keeps a fully opaque source unchanged", () => {
    expect(
      calculateAlphaCompositing({
        backdrop: "#00FF00",
        source: "#123456",
        sourceOpacity: 1,
      }),
    ).toMatchObject({ alpha: 1, hex: "#123456" });
  });

  it("falls back to the backdrop when the source is transparent", () => {
    expect(
      calculateAlphaCompositing({
        backdrop: "#ABCDEF",
        source: "#FF0000",
        sourceOpacity: 0,
      }),
    ).toMatchObject({ alpha: 1, hex: "#ABCDEF" });
  });

  it("returns black with zero alpha when both colors are transparent", () => {
    const output = calculateAlphaCompositing({
      backdrop: "#FFFFFF",
      backdropOpacity: 0,
      source: "#FF0000",
      sourceOpacity: 0,
    });
    expect(output).toMatchObject({ alpha: 0, hex: "#000000" });
  });

  it("combines partial opacities", () => {
    const output = calculateAlphaCompositing({
      backdrop: "#FFFFFF",
      backdropOpacity: 0.5,
      source: "#FF0000",
      sourceOpacity: 0.5,
    });
    // Output alpha is 0.5 + 0.5 * 0.5 = 0.75.
    expect(output.alpha).toBe(0.75);
  });

  it("rejects malformed colors and out-of-range opacities", () => {
    expect(
      runAlphaCompositing({ backdrop: "#FFFFFF", source: "nope" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_color", field: "source" }] },
      ok: false,
    });
    expect(
      runAlphaCompositing({
        backdrop: "#FFFFFF",
        source: "#FF0000",
        sourceOpacity: 1.5,
      }).ok,
    ).toBe(false);
  });
});
