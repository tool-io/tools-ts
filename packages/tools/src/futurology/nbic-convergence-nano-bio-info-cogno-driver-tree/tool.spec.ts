import { describe, expect, it } from "vitest";
import {
  nbicConvergenceTreeExample,
  runNbicConvergenceTree,
  validateNbicConvergenceDriverTree,
} from "./tool.js";

describe("NBIC convergence driver tree", () => {
  it("reproduces its canonical example", () => {
    expect(runNbicConvergenceTree(nbicConvergenceTreeExample.input)).toEqual({
      ok: true,
      output: nbicConvergenceTreeExample.output,
    });
  });

  it("normalizes convergence area casing", () => {
    expect(
      validateNbicConvergenceDriverTree({
        convergenceAreas: ["NANO", "Info"],
        driverIds: ["Root", "Child"],
        parentIndices: [-1, 0],
      }).representedAreas,
    ).toEqual(["cogno", "info", "nano"].filter((area) => area !== "cogno"));
  });

  it("detects multiple roots", () => {
    expect(
      validateNbicConvergenceDriverTree({
        convergenceAreas: ["info", "bio"],
        driverIds: ["A", "B"],
        parentIndices: [-1, -1],
      }).validTree,
    ).toBe(false);
  });

  it("rejects an unknown convergence area", () => {
    expect(
      runNbicConvergenceTree({
        convergenceAreas: ["unknown"],
        driverIds: ["A"],
        parentIndices: [-1],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_convergence_area", field: "convergenceAreas.0" },
        ],
      },
      ok: false,
    });
  });
});
