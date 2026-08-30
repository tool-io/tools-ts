import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateParkettBedarfVerschnitt, example } from "./tool.js";

describe("carpentry/parkett-bedarf-verschnitt", () => {
  it("matches its worked example", () => {
    expect(calculateParkettBedarfVerschnitt(example.input)).toEqual(
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
      tool.execute({ ...example.input, netFloorSquareMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative netFloorSquareMeters", () => {
    expect(
      tool.execute({ ...example.input, netFloorSquareMeters: -1 }).ok,
    ).toBe(false);
  });
});
