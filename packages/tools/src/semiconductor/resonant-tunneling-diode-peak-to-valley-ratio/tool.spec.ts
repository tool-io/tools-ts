import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateResonantTunnelingDiodePeakToValleyRatio,
  example,
} from "./tool.js";

describe("semiconductor/resonant-tunneling-diode-peak-to-valley-ratio", () => {
  it("matches its worked example", () => {
    expect(
      calculateResonantTunnelingDiodePeakToValleyRatio(example.input),
    ).toEqual(example.output);
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
    expect(tool.execute({ ...example.input, peakAmperes: Number.NaN }).ok).toBe(
      false,
    );
  });
  it("rejects a negative peakAmperes", () => {
    expect(tool.execute({ ...example.input, peakAmperes: -1 }).ok).toBe(false);
  });
});
