import { describe, expect, it } from "vitest";
import {
  calculateRackCubeUtilizationPercent,
  rackCubeUtilizationPercentExample,
  runRackCubeUtilizationPercent,
} from "./tool.js";

describe("rack-cube-utilization-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRackCubeUtilizationPercent(rackCubeUtilizationPercentExample.input),
    ).toEqual({
      ok: true,
      output: rackCubeUtilizationPercentExample.output,
    });
  });

  it("reports zero utilization for an empty rack", () => {
    expect(
      runRackCubeUtilizationPercent({
        occupiedStoragePositions: 0,
        totalStoragePositions: 200,
        storedVolumeCbm: 0,
        rackVolumeCapacityCbm: 500,
      }),
    ).toEqual({
      ok: true,
      output: { cubeUtilizationPercent: 0, positionUtilizationPercent: 0 },
    });
  });
  it("rejects occupied positions above total", () => {
    expect(
      runRackCubeUtilizationPercent({
        occupiedStoragePositions: 201,
        totalStoragePositions: 200,
        storedVolumeCbm: 10,
        rackVolumeCapacityCbm: 500,
      }).ok,
    ).toBe(false);
  });

  it("rejects invalid direct capacities and fractional counts", () => {
    expect(() =>
      calculateRackCubeUtilizationPercent({
        occupiedStoragePositions: 1.5,
        rackVolumeCapacityCbm: 100,
        storedVolumeCbm: 50,
        totalStoragePositions: 2,
      }),
    ).toThrow("whole numbers");
    expect(() =>
      calculateRackCubeUtilizationPercent({
        occupiedStoragePositions: 1,
        rackVolumeCapacityCbm: Number.POSITIVE_INFINITY,
        storedVolumeCbm: 50,
        totalStoragePositions: 2,
      }),
    ).toThrow("must be finite");
  });
});
