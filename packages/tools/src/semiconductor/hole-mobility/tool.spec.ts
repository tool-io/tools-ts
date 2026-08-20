import { describe, expect, it } from "vitest";
import { holeMobilityExample, runHoleMobility } from "./tool.js";

describe("hole mobility calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHoleMobility(holeMobilityExample.input)).toEqual({
      ok: true,
      output: holeMobilityExample.output,
    });
  });

  it("stays below the electron mobility at equal doping", async () => {
    const { runElectronMobility } = await import(
      "../electron-mobility/tool.js"
    );
    const holes = runHoleMobility({ acceptorConcentrationPerCm3: 1e15 });
    const electrons = runElectronMobility({
      donorConcentrationPerCm3: 1e15,
    });
    if (!holes.ok || !electrons.ok) throw new Error("expected success");
    const holeMobility = (holes.output as { mobilityCm2PerVs: number })
      .mobilityCm2PerVs;
    const electronMobility = (electrons.output as {
      mobilityCm2PerVs: number;
    }).mobilityCm2PerVs;
    expect(holeMobility).toBeLessThan(electronMobility);
  });
});
