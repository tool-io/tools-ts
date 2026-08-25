import { describe, expect, it } from "vitest";
import {
  largePackageCubicCapacityCheckerExample,
  runLargePackageCubicCapacityChecker,
} from "./tool.js";

describe("large-package-cubic-capacity-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLargePackageCubicCapacityChecker(
        largePackageCubicCapacityCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: largePackageCubicCapacityCheckerExample.output,
    });
  });

  it("flags shipments over the cubic limit", () => {
    const result = runLargePackageCubicCapacityChecker({
      lengthCm: 100,
      widthCm: 100,
      heightCm: 100,
      cartonQuantity: 2,
      maximumVolumeCm3: 1500000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.withinCapacity).toBe(false);
    expect(result.output.capacityUtilizationPercent as number).toBeCloseTo(
      133.33333333333331,
    );
  });
  it("rejects zero capacity limits", () => {
    expect(
      runLargePackageCubicCapacityChecker({
        lengthCm: 60,
        widthCm: 40,
        heightCm: 40,
        maximumVolumeCm3: 0,
      }).ok,
    ).toBe(false);
  });
});
