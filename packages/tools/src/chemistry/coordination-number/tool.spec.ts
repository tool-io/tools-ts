import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateCoordinationNumber,
  coordinationNumberExample,
  CoordinationNumberTool,
  runCoordinationNumber,
} from "./tool.js";

describe("Coordination Number Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(runCoordinationNumber(coordinationNumberExample.input)).toEqual({
      ok: true,
      output: coordinationNumberExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(CoordinationNumberTool)).toEqual([]);
  });

  it("maps each packing to its nearest-neighbour count", () => {
    expect(
      calculateCoordinationNumber({ unitCellType: "simple-cubic" })
        .coordinationNumber,
    ).toBe(6);
    expect(
      calculateCoordinationNumber({ unitCellType: "body-centered-cubic" })
        .coordinationNumber,
    ).toBe(8);
    expect(
      calculateCoordinationNumber({ unitCellType: "hexagonal-close-packed" })
        .coordinationNumber,
    ).toBe(12);
  });

  it("rejects unknown packings and invalid input", () => {
    expect(runCoordinationNumber({ unitCellType: "triclinic" }).ok).toBe(false);
    expect(runCoordinationNumber(null).ok).toBe(false);
  });
});
