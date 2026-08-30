import { describe, expect, it } from "vitest";
import {
  calculateStorageBoxFlipCount,
  example,
  runStorageBoxFlipCount,
} from "./tool.js";

describe("numismatics/storage-box-flip-count", () => {
  it("calculates the published example", () => {
    expect(calculateStorageBoxFlipCount(example.input)).toEqual(example.output);
    expect(runStorageBoxFlipCount(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runStorageBoxFlipCount({
      ...example.input,
      boxInsideLengthMillimeters: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runStorageBoxFlipCount({ ...example.input, flipThicknessMillimeters: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "flipThicknessMillimeters" }] },
    });
  });
});
