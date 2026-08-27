import { describe, expect, it } from "vitest";
import {
  argonDiffusionClosureTemperatureExample,
  runArgonDiffusionClosureTemperature,
} from "./tool.js";

describe("geology/argon-diffusion-closure-temperature", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runArgonDiffusionClosureTemperature(
        argonDiffusionClosureTemperatureExample.input,
      ),
    ).toEqual({
      ok: true,
      output: argonDiffusionClosureTemperatureExample.output,
    });
  });

  it("raises closure temperature with faster cooling", () => {
    const slow = runArgonDiffusionClosureTemperature({});
    const fast = runArgonDiffusionClosureTemperature({
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
      runArgonDiffusionClosureTemperature({ activationEnergyKJPerMol: 0 }).ok,
    ).toBe(false);
    expect(
      runArgonDiffusionClosureTemperature({ coolingRateKPerMillionYears: -5 })
        .ok,
    ).toBe(false);
  });
});
