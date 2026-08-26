import { describe, expect, it } from "vitest";
import { drawerSideLengthExample, runDrawerSideLength } from "./tool.js";

describe("Drawer Side Length Rule", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDrawerSideLength(drawerSideLengthExample.input)).toEqual({
      ok: true,
      output: drawerSideLengthExample.output,
    });
  });

  it("subtracts 54 millimeters from another standard front", () => {
    expect(runDrawerSideLength({ frontWidthMm: 900 })).toEqual({
      ok: true,
      output: { sideLengthMm: 846 },
    });
  });

  it("returns one millimeter for the smallest valid integer front", () => {
    expect(runDrawerSideLength({ frontWidthMm: 55 })).toEqual({
      ok: true,
      output: { sideLengthMm: 1 },
    });
  });

  it("accepts fractional fronts just above the limit", () => {
    expect(runDrawerSideLength({ frontWidthMm: 54.5 })).toEqual({
      ok: true,
      output: { sideLengthMm: 0.5 },
    });
  });

  it("rejects a front of exactly 54 millimeters", () => {
    const result = runDrawerSideLength({ frontWidthMm: 54 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("must_exceed_54");
  });

  it("rejects fronts below 54 millimeters", () => {
    expect(runDrawerSideLength({ frontWidthMm: 40 }).ok).toBe(false);
  });

  it("rejects zero and negative fronts", () => {
    expect(runDrawerSideLength({ frontWidthMm: 0 }).ok).toBe(false);
    expect(runDrawerSideLength({ frontWidthMm: -600 }).ok).toBe(false);
  });

  it("requires the front width", () => {
    expect(runDrawerSideLength({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runDrawerSideLength({ extra: true, frontWidthMm: 600 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });
});
