import { describe, expect, it } from "vitest";
import { runSubstrateWarpage, substrateWarpageExample } from "./tool.js";

describe("substrate curvature warpage", () => {
  it("reproduces the documented circular-arc sagitta", () =>
    expect(runSubstrateWarpage(substrateWarpageExample.input)).toEqual({
      ok: true,
      output: substrateWarpageExample.output,
    }));
  it("approximately quadruples when panel span doubles", () => {
    const small = runSubstrateWarpage({
      curvaturePerMeter: 0.001,
      panelDiagonalMm: 100,
    });
    const large = runSubstrateWarpage({
      curvaturePerMeter: 0.001,
      panelDiagonalMm: 200,
    });
    expect(
      small.ok &&
        large.ok &&
        Number(large.output.warpageUm) / Number(small.output.warpageUm),
    ).toBeCloseTo(4, 6);
  });
  it("rejects a nonpositive curvature magnitude", () =>
    expect(
      runSubstrateWarpage({ curvaturePerMeter: 0, panelDiagonalMm: 100 }),
    ).toMatchObject({ ok: false }));
});
