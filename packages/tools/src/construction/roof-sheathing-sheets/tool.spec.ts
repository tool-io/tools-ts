import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRoofSheathingSheets, example } from "./tool.js";

describe("construction/roof-sheathing-sheets", () => {
  it("matches its worked example", () => {
    expect(calculateRoofSheathingSheets(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and nonfinite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, roofSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative roofSquareMeters", () => {
    expect(tool.execute({ ...example.input, roofSquareMeters: -1 }).ok).toBe(
      false,
    );
  });
});
