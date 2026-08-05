import { describe, expect, it } from "vitest";
import { convertArea, areaExample, runArea } from "./tool.js";

describe("Convert Area", () => {
  it("converts the canonical example", () =>
    expect(
      convertArea(
        areaExample.input.value,
        areaExample.input.fromUnit,
        areaExample.input.toUnit,
      ),
    ).toBeCloseTo(areaExample.output.value, 9));

  it("preserves values when the units match", () =>
    expect(convertArea(3, "sqm", "sqm")).toBe(3));

  it("rejects unknown units and non-finite values", () => {
    expect(convertArea(1, "unknown", "sqm")).toBeNull();
    expect(convertArea(Number.NaN, "sqm", "sqm")).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runArea(areaExample.input)).toEqual({
      ok: true,
      output: areaExample.output,
    }));
});
