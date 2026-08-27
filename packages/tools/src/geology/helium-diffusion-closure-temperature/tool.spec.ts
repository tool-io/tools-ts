import { describe, expect, it } from "vitest";
import {
  heliumDiffusionClosureTemperatureExample,
  runHeliumDiffusionClosureTemperature,
} from "./tool.js";

describe("geology/helium-diffusion-closure-temperature", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeliumDiffusionClosureTemperature(
        heliumDiffusionClosureTemperatureExample.input,
      ),
    ).toEqual({
      ok: true,
      output: heliumDiffusionClosureTemperatureExample.output,
    });
  });

  it("raises closure temperature with faster cooling", () => {
    const slow = runHeliumDiffusionClosureTemperature({});
    const fast = runHeliumDiffusionClosureTemperature({
      coolingRateKPerMillionYears: 1000,
    });
    expect(slow.ok && fast.ok).toBe(true);
    if (slow.ok && fast.ok)
      expect(fast.output.closureTemperatureC as number).toBeGreaterThan(
        slow.output.closureTemperatureC as number,
      );
  });

  it("rejects non-positive kinetics", () => {
    expect(
      runHeliumDiffusionClosureTemperature({ activationEnergyKJPerMol: 0 }).ok,
    ).toBe(false);
    expect(
      runHeliumDiffusionClosureTemperature({ coolingRateKPerMillionYears: -5 })
        .ok,
    ).toBe(false);
  });
});
