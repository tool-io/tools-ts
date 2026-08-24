import { describe, expect, it } from "vitest";
import {
  runVcselEdgeEmitterComparison,
  vcselEdgeEmitterComparisonExample as example,
} from "./tool.js";
describe("VCSEL and edge-emitter divergence", () => {
  it("converts full-angle divergence to spot diameter", () =>
    expect(runVcselEdgeEmitterComparison(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects divergence at or above 180 degrees", () =>
    expect(
      runVcselEdgeEmitterComparison({
        distanceMm: 100,
        edgeFastAxisDeg: 180,
        edgeSlowAxisDeg: 10,
        vcselFullAngleDeg: 12,
      }).ok,
    ).toBe(false));
});
