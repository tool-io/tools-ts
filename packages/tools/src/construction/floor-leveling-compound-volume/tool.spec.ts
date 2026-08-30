import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateFloorLevelingCompoundVolume, example } from "./tool.js";

describe("construction/floor-leveling-compound-volume", () => {
  it("matches its worked example", () => {
    expect(calculateFloorLevelingCompoundVolume(example.input)).toEqual(
      example.output,
    );
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
      tool.execute({ ...example.input, areaSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative areaSquareMeters", () => {
    expect(tool.execute({ ...example.input, areaSquareMeters: -1 }).ok).toBe(
      false,
    );
  });
});
