import { describe, expect, it } from "vitest";
import {
  calculateSlabStorageBoxRowCount,
  example,
  runSlabStorageBoxRowCount,
} from "./tool.js";

describe("numismatics/slab-storage-box-row-count", () => {
  it("calculates the published example", () => {
    expect(calculateSlabStorageBoxRowCount(example.input)).toEqual(
      example.output,
    );
    expect(runSlabStorageBoxRowCount(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSlabStorageBoxRowCount({
      ...example.input,
      boxInsideLengthMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runSlabStorageBoxRowCount({
        ...example.input,
        slabThicknessMillimeters: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "slabThicknessMillimeters" }] },
    });
  });
});
