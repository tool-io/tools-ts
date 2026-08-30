import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, { calculateHelmholtzResonanceFrequency, example } from "./tool.js";

describe("acoustics/helmholtz-resonance-frequency", () => {
  it("matches its worked example", () => {
    expect(calculateHelmholtzResonanceFrequency(example.input)).toEqual(
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
      tool.execute({ ...example.input, soundSpeedMetersPerSecond: Number.NaN })
        .ok,
    ).toBe(false);
  });
});
