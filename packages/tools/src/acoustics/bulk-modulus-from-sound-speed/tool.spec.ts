import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateBulkModulusFromSoundSpeed, example } from "./tool.js";

describe("acoustics/bulk-modulus-from-sound-speed", () => {
  it("matches its worked example", () => {
    expect(calculateBulkModulusFromSoundSpeed(example.input)).toEqual(
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
      tool.execute({ ...example.input, densityKgPerCubicMeter: Number.NaN }).ok,
    ).toBe(false);
  });
});
