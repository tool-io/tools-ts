import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateUnitCellVolume,
  runUnitCellVolume,
  UnitCellVolumeTool,
  unitCellVolumeExample,
} from "./tool.js";

describe("Unit Cell Volume Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runUnitCellVolume(unitCellVolumeExample.input)).toEqual({
      ok: true,
      output: unitCellVolumeExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(UnitCellVolumeTool)).toEqual([]);
  });

  it("cubes the edge for a cubic cell", () => {
    expect(
      calculateUnitCellVolume({
        edgeAPicometers: 300,
        edgeBPicometers: 300,
        edgeCPicometers: 300,
      }).volumeCubicPicometers,
    ).toBe(27000000);
  });

  it("rejects nonpositive edges and invalid input", () => {
    expect(
      runUnitCellVolume({ ...unitCellVolumeExample.input, edgeAPicometers: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value" }] },
      ok: false,
    });
    expect(
      runUnitCellVolume({ ...unitCellVolumeExample.input, edgeCPicometers: -5 })
        .ok,
    ).toBe(false);
    expect(runUnitCellVolume(null).ok).toBe(false);
  });
});
