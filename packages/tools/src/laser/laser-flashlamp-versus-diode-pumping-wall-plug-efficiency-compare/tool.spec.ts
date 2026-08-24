import { describe, expect, it } from "vitest";
import {
  runWallPlugCompare,
  wallPlugCompareExample as example,
} from "./tool.js";
describe("pump wall-plug efficiency chain", () => {
  it("applies the Stokes factor once per chain", () =>
    expect(runWallPlugCompare(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("keeps both modeled efficiencies below 100 percent", () => {
    const result = runWallPlugCompare({});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.flashlampWallPlugPercent).toBeLessThan(100);
      expect(result.output.diodeWallPlugPercent).toBeLessThan(100);
    }
  });
});
