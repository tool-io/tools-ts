import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateAdcApertureJitterSnrLimit, example } from "./tool.js";

describe("electronics/adc-aperture-jitter-snr-limit", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateAdcApertureJitterSnrLimit(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, inputFrequencyHz: Number.NaN }).ok,
    ).toBe(false);
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{ inputFrequencyHz: 1e-200, rmsJitterSeconds: 1e-200 },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.jitterLimitedSnrDb / 7984.036402632838).toBeCloseTo(
        1,
        8,
      );
  });
});
