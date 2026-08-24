import { describe, expect, it } from "vitest";
import { hullSpeedExample as example, runHullSpeed } from "./tool.js";
describe("hull speed", () => {
  it("applies 1.34 times the square root of waterline feet", () =>
    expect(runHullSpeed(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("requires positive waterline length", () =>
    expect(runHullSpeed({ waterlineLengthFeet: 0 }).ok).toBe(false));
});
