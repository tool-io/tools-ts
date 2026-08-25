import { describe, expect, it } from "vitest";
import {
  calculateCurrentShearGain,
  currentShearGainExample,
  runCurrentShearGain,
} from "./tool.js";

describe("Current Shear Gain", () => {
  it("publishes an executable example", () =>
    expect(runCurrentShearGain(currentShearGainExample.input)).toEqual({
      ok: true,
      output: currentShearGainExample.output,
    }));

  it.each([
    [2.5, 1.25, 1.25],
    [1, 3, -2],
    [2, 2, 0],
    [0, 1.5, -1.5],
    [3, 0, 3],
  ])(
    "subtracts the deeper layer from the surface",
    (nearSurfaceKt, deeperLayerKt, expected) => {
      expect(
        calculateCurrentShearGain({ deeperLayerKt, nearSurfaceKt }),
      ).toEqual({ shearGainKt: expected });
    },
  );

  it("reports positive shear when the surface runs faster", () => {
    expect(
      runCurrentShearGain({ deeperLayerKt: 0.5, nearSurfaceKt: 2 }),
    ).toEqual({ ok: true, output: { shearGainKt: 1.5 } });
  });

  it("reports negative shear when the depth runs faster", () => {
    expect(
      runCurrentShearGain({ deeperLayerKt: 2, nearSurfaceKt: 0.5 }).ok,
    ).toBe(true);
    expect(
      calculateCurrentShearGain({ deeperLayerKt: 2, nearSurfaceKt: 0.5 }),
    ).toEqual({ shearGainKt: -1.5 });
  });

  it("is antisymmetric when swapping layers", () => {
    const forward = calculateCurrentShearGain({
      deeperLayerKt: 1.75,
      nearSurfaceKt: 3.25,
    })!.shearGainKt;
    const reversed = calculateCurrentShearGain({
      deeperLayerKt: 3.25,
      nearSurfaceKt: 1.75,
    })!.shearGainKt;
    expect(forward + reversed).toBe(0);
  });

  it("yields zero for a well mixed column", () => {
    expect(
      calculateCurrentShearGain({ deeperLayerKt: 1.1, nearSurfaceKt: 1.1 }),
    ).toEqual({ shearGainKt: 0 });
  });

  it.each([[-0.5], [-2]])(
    "rejects negative layer speeds at the schema level",
    (negative) => {
      expect(
        runCurrentShearGain({ deeperLayerKt: negative, nearSurfaceKt: 1 }).ok,
      ).toBe(false);
      expect(
        runCurrentShearGain({ deeperLayerKt: 1, nearSurfaceKt: negative }).ok,
      ).toBe(false);
    },
  );

  it("rejects unknown fields and null input", () => {
    expect(
      runCurrentShearGain({ boundary: 10, deeperLayerKt: 1, nearSurfaceKt: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field" }] },
      ok: false,
    });
    expect(runCurrentShearGain(null as never).ok).toBe(false);
  });
});
