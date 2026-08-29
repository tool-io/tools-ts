import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateRfidReadRange, example } from "./tool.js";

describe("electronics/rfid-read-range", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculateRfidReadRange(example.input)).toEqual(example.output);
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(tool.execute({ ...example.input, frequencyHz: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("preserves finite results at extreme input scales", () => {
    const result = tool.execute({
      ...example.input,
      ...{
        frequencyHz: 100000000,
        readerPowerW: 1e308,
        readerGainLinear: 4,
        tagGainLinear: 1,
        tagActivationPowerW: 1e308,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.rangeMeters / 0.47713451592369427).toBeCloseTo(1, 8);
  });
  it("does not lose a representable result to intermediate underflow", () => {
    const result = tool.execute({
      ...example.input,
      ...{
        frequencyHz: 1e308,
        readerPowerW: 1,
        readerGainLinear: 1,
        tagGainLinear: 1,
        tagActivationPowerW: 1,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.rangeMeters / 2.3856725796184712e-301).toBeCloseTo(
        1,
        8,
      );
  });
});
