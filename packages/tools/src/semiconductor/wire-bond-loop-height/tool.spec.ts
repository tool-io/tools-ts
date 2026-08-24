import { describe, expect, it } from "vitest";
import { runWireBondLoopHeight, wireBondLoopHeightExample } from "./tool.js";

describe("symmetric wire-bond loop height", () => {
  it("reproduces the documented example", () =>
    expect(runWireBondLoopHeight(wireBondLoopHeightExample.input)).toEqual({
      ok: true,
      output: wireBondLoopHeightExample.output,
    }));
  it("supports physically valid rise angles above 45 degrees", () =>
    expect(
      runWireBondLoopHeight({ loopAngleDegrees: 60, spanUm: 2000 }),
    ).toMatchObject({ ok: true }));
  it("rejects a vertical or overhanging straight-segment model", () =>
    expect(
      runWireBondLoopHeight({ loopAngleDegrees: 90, spanUm: 2000 }),
    ).toMatchObject({ ok: false }));
});
