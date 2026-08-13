import { describe, expect, it } from "vitest";
import {
  calculateWaistToHeight,
  runWaistToHeight,
  waistToHeightExample,
} from "./tool.js";
describe("waist to height", () => {
  it("publishes an executable example", () =>
    expect(runWaistToHeight(waistToHeightExample.input)).toEqual({
      ok: true,
      output: waistToHeightExample.output,
    }));

  it("rejects non-finite and non-positive measurements", () => {
    expect(calculateWaistToHeight(80, Infinity)).toBeNull();
    expect(calculateWaistToHeight(0, 180)).toBeNull();
  });
});
