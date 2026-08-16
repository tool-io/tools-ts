import { describe, expect, it } from "vitest";
import { blendExample, calculateBlend, runBlend } from "./tool.js";

describe("color blend calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBlend(blendExample.input)).toEqual({
      ok: true,
      output: blendExample.output,
    });
  });

  it("returns the endpoints at amounts zero and one", () => {
    expect(
      calculateBlend({ amount: 0, from: "#123456", to: "#FEDCBA" }).hex,
    ).toBe("#123456");
    expect(
      calculateBlend({ amount: 1, from: "#123456", to: "#FEDCBA" }).hex,
    ).toBe("#FEDCBA");
  });

  it("blends channels proportionally", () => {
    expect(
      calculateBlend({
        amount: 0.5,
        from: "#FF0000",
        to: "#0000FF",
      }).hex,
    ).toBe("#800080");
    expect(
      calculateBlend({ amount: 0.25, from: "#000000", to: "#FFFFFF" }).hex,
    ).toBe("#404040");
  });

  it("rejects malformed colors and out-of-range amounts", () => {
    expect(runBlend({ from: "#GGGGGG", to: "#FFFFFF" })).toMatchObject({
      error: { issues: [{ code: "invalid_color", field: "from" }] },
      ok: false,
    });
    expect(
      runBlend({ amount: -0.1, from: "#000000", to: "#FFFFFF" }).ok,
    ).toBe(false);
  });
});
