import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateDewateringPumpCapacity, example } from "./tool.js";

describe("construction/dewatering-pump-capacity", () => {
  it("matches its worked example", () => {
    expect(calculateDewateringPumpCapacity(example.input)).toEqual(
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
      tool.execute({ ...example.input, waterCubicMeters: Number.NaN }).ok,
    ).toBe(false);
  });
  it("rejects a negative waterCubicMeters", () => {
    expect(tool.execute({ ...example.input, waterCubicMeters: -1 }).ok).toBe(
      false,
    );
  });
});
