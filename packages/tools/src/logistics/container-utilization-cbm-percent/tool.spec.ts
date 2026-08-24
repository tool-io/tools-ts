import { describe, expect, it } from "vitest";
import {
  calculateContainerUtilizationCbmPercent,
  containerUtilizationCbmPercentExample,
  runContainerUtilizationCbmPercent,
} from "./tool.js";

describe("container-utilization-cbm-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runContainerUtilizationCbmPercent(
        containerUtilizationCbmPercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: containerUtilizationCbmPercentExample.output,
    });
  });

  it("reports full utilization for an exact fill", () => {
    const result = runContainerUtilizationCbmPercent({
      usedVolumeCbm: 67.7,
      containerCapacityCbm: 67.7,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.utilizationPercent).toBe(100);
    expect(result.output.freeVolumeCbm).toBe(0);
  });

  it("normalizes empty utilization to positive zero", () => {
    const output = calculateContainerUtilizationCbmPercent({
      usedVolumeCbm: -0,
      containerCapacityCbm: 10,
    });
    expect(Object.is(output.utilizationPercent, -0)).toBe(false);
    expect(output).toEqual({ freeVolumeCbm: 10, utilizationPercent: 0 });
  });

  it("rejects used volume above capacity with a specific issue", () => {
    const result = runContainerUtilizationCbmPercent({
      usedVolumeCbm: 40,
      containerCapacityCbm: 33.2,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0]).toMatchObject({
      code: "invalid_volume",
      field: "usedVolumeCbm",
    });
  });

  it("rejects non-finite direct volumes and zero capacity", () => {
    expect(() =>
      calculateContainerUtilizationCbmPercent({
        usedVolumeCbm: Number.NaN,
        containerCapacityCbm: 10,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateContainerUtilizationCbmPercent({
        usedVolumeCbm: 0,
        containerCapacityCbm: 0,
      }),
    ).toThrow("greater than zero");
  });
});
