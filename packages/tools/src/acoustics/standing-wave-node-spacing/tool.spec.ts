import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateStandingWaveNodeSpacing, example } from "./tool.js";

describe("acoustics/standing-wave-node-spacing", () => {
  it("matches its worked example", () => {
    expect(calculateStandingWaveNodeSpacing(example.input)).toEqual(
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
      tool.execute({ ...example.input, wavelengthMeters: Number.NaN }).ok,
    ).toBe(false);
  });
});
