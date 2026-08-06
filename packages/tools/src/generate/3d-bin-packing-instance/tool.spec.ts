import { describe, expect, it } from "vitest";
import {
  runThreeDimensionalBinPackingInstance,
  threeDimensionalBinPackingInstanceExample,
} from "./tool.js";

describe("3D bin packing instance", () => {
  it("publishes an executable example", () => {
    expect(
      runThreeDimensionalBinPackingInstance(
        threeDimensionalBinPackingInstanceExample.input,
      ),
    ).toEqual({
      ok: true,
      output: threeDimensionalBinPackingInstanceExample.output,
    });
  });
  it("rejects boxes whose minimum cannot fit", () => {
    expect(
      runThreeDimensionalBinPackingInstance({
        ...threeDimensionalBinPackingInstanceExample.input,
        minimumDimension: 11,
      }).ok,
    ).toBe(false);
  });
});
