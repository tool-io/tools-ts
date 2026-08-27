import { describe, expect, it } from "vitest";
import { runWaterPotentialTotal, waterPotentialTotalExample } from "./tool.js";

describe("Total Water Potential", () => {
  it("publishes an executable example", () =>
    expect(runWaterPotentialTotal(waterPotentialTotalExample.input)).toEqual({
      ok: true,
      output: waterPotentialTotalExample.output,
    }));
  it("defaults the matric potential to zero", () =>
    expect(
      runWaterPotentialTotal({
        osmoticPotentialMpa: -0.9,
        pressurePotentialMpa: 0.4,
      }),
    ).toEqual({ ok: true, output: { totalWaterPotentialMpa: -0.5 } }));
  it("sums signed components", () =>
    expect(
      runWaterPotentialTotal({
        matricPotentialMpa: 0.1,
        osmoticPotentialMpa: -0.3,
        pressurePotentialMpa: -0.2,
      }),
    ).toEqual({ ok: true, output: { totalWaterPotentialMpa: -0.4 } }));
  it("rejects non-finite inputs", () =>
    expect(
      runWaterPotentialTotal({
        matricPotentialMpa: Number.NaN,
        osmoticPotentialMpa: -0.9,
        pressurePotentialMpa: 0.4,
      }).ok,
    ).toBe(false));
});
