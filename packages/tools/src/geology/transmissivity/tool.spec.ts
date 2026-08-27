import { describe, expect, it } from "vitest";
import { transmissivityExample, runTransmissivity } from "./tool.js";

describe("transmissivity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTransmissivity(transmissivityExample.input)).toEqual({
      ok: true,
      output: transmissivityExample.output,
    });
  });

  it("returns zero transmissivity for zero conductivity", () => {
    const result = runTransmissivity({
      hydraulicConductivityMS: 0,
      aquiferThicknessM: 30,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.transmissivityM2PerS as number).toBe(0);
  });

  it("rejects non-positive aquifer thicknesses", () => {
    expect(
      runTransmissivity({ hydraulicConductivityMS: 1e-4, aquiferThicknessM: 0 })
        .ok,
    ).toBe(false);
  });
});
