import { describe, expect, it } from "vitest";
import {
  binPackingInstanceExample,
  generateBinPackingInstance,
  runBinPackingInstance,
} from "./tool.js";
describe("Bin Packing Instance", () => {
  it("keeps items within bounds", () =>
    expect(
      generateBinPackingInstance(20, 1, 10, 15, "seed")?.items.every(
        (item) => item >= 1 && item <= 10,
      ),
    ).toBe(true));
  it("publishes an executable example", () =>
    expect(runBinPackingInstance(binPackingInstanceExample.input)).toEqual({
      ok: true,
      output: binPackingInstanceExample.output,
    }));
});
