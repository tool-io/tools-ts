import { describe, expect, it } from "vitest";
import {
  corePermeabilityKlinkenbergCorrectedExample,
  runCorePermeabilityKlinkenbergCorrected,
} from "./tool.js";

describe("core-permeability-klinkenberg-corrected", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCorePermeabilityKlinkenbergCorrected(
        corePermeabilityKlinkenbergCorrectedExample.input,
      ),
    ).toEqual({
      ok: true,
      output: corePermeabilityKlinkenbergCorrectedExample.output,
    });
  });

  it("returns the measured permeability when there is no slippage", () => {
    const result = runCorePermeabilityKlinkenbergCorrected({
      gasPermeabilityMd: 42,
      slippageFactorKpa: 0,
      meanPorePressureKpa: 150,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.klinkenbergPermeabilityMd as number).toBe(42);
  });

  it("rejects non-positive mean pore pressure", () => {
    expect(
      runCorePermeabilityKlinkenbergCorrected({
        gasPermeabilityMd: 100,
        slippageFactorKpa: 10,
        meanPorePressureKpa: 0,
      }).ok,
    ).toBe(false);
  });
});
