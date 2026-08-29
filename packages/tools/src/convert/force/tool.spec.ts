import { describe, expect, it } from "vitest";
import { forceExample, runForce } from "./tool.js";

describe("force converter", () => {
  it("reproduces the standard-gravity kilogram-force example", () => {
    expect(runForce(forceExample.input)).toEqual({
      ok: true,
      output: forceExample.output,
    });
  });

  it("converts one pound-force to newtons", () => {
    expect(runForce({ fromUnit: "lbf", toUnit: "N", value: 1 })).toEqual({
      ok: true,
      output: { unit: "N", value: 4.4482216152605 },
    });
  });

  it("rejects an unsupported unit", () => {
    expect(runForce({ fromUnit: "J", toUnit: "N", value: 1 }).ok).toBe(false);
  });
});
