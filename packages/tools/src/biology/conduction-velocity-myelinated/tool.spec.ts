import { describe, expect, it } from "vitest";
import { runConductionVelocityMyelinated } from "./tool.js";

describe("Conduction Velocity", () => {
  it("calculates a valid result", () =>
    expect(runConductionVelocityMyelinated({ diameterUm: 10 })).toEqual({
      ok: true,
      output: { conductionVelocityMPerS: 60 },
    }));
  it("uses the documented factor of six per micrometre", () => {
    const result = runConductionVelocityMyelinated({ diameterUm: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.conductionVelocityMPerS).toBe(6);
  });
  it("scales linearly with diameter", () => {
    const result = runConductionVelocityMyelinated({ diameterUm: 20 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.conductionVelocityMPerS).toBe(120);
  });
  it("handles fractional diameters", () => {
    const result = runConductionVelocityMyelinated({ diameterUm: 2.5 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.conductionVelocityMPerS).toBeCloseTo(15, 12);
  });
  it("rejects zero diameter", () =>
    expect(runConductionVelocityMyelinated({ diameterUm: 0 }).ok).toBe(false));
  it("rejects negative diameter", () =>
    expect(runConductionVelocityMyelinated({ diameterUm: -10 }).ok).toBe(
      false,
    ));
});
