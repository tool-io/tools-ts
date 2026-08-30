import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateWasteRecyclingPercentage, example } from "./tool.js";

describe("construction/waste-recycling-percentage", () => {
  it("matches its worked example", () => {
    expect(calculateWasteRecyclingPercentage(example.input)).toEqual(
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
      tool.execute({ ...example.input, recycledKilograms: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative recycledKilograms", () => {
    expect(tool.execute({ ...example.input, recycledKilograms: -1 }).ok).toBe(
      false,
    );
  });
});
