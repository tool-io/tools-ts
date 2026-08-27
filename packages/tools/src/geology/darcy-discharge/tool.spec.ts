import { describe, expect, it } from "vitest";
import { darcyDischargeExample, runDarcyDischarge } from "./tool.js";

describe("darcy-discharge", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDarcyDischarge(darcyDischargeExample.input)).toEqual({
      ok: true,
      output: darcyDischargeExample.output,
    });
  });

  it("doubles discharge when area doubles", () => {
    const result = runDarcyDischarge({
      hydraulicConductivityMS: 1e-6,
      hydraulicGradient: 0.01,
      crossSectionalAreaM2: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.dischargeM3PerS as number).toBe(1e-6);
  });

  it("rejects negative areas", () => {
    expect(
      runDarcyDischarge({
        hydraulicConductivityMS: 1e-6,
        hydraulicGradient: 0.01,
        crossSectionalAreaM2: -5,
      }).ok,
    ).toBe(false);
  });
});
