import { describe, expect, it } from "vitest";
import { darcyVelocityExample, runDarcyVelocity } from "./tool.js";

describe("darcy-velocity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDarcyVelocity(darcyVelocityExample.input)).toEqual({
      ok: true,
      output: darcyVelocityExample.output,
    });
  });

  it("returns zero velocity for zero conductivity", () => {
    const result = runDarcyVelocity({
      hydraulicConductivityMS: 0,
      hydraulicGradient: 0.01,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.darcyVelocityMS as number).toBe(0);
  });

  it("rejects negative gradients", () => {
    expect(
      runDarcyVelocity({ hydraulicConductivityMS: 1e-4, hydraulicGradient: -1 })
        .ok,
    ).toBe(false);
  });
});
