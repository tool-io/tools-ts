import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculatePhaseNoiseIntegratedJitterSimple,
  example,
} from "./tool.js";

describe("electronics/phase-noise-integrated-jitter-simple", () => {
  it("matches its canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculatePhaseNoiseIntegratedJitterSimple(example.input)).toEqual(
      example.output,
    );
  });
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });
  it("rejects missing and non-finite inputs", () => {
    expect(tool.execute({}).ok).toBe(false);
    expect(
      tool.execute({ ...example.input, integratedPhaseNoiseRatio: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
