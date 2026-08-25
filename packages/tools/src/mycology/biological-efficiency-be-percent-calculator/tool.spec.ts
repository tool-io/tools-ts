import { describe, expect, it } from "vitest";
import { runBiologicalEfficiencyBePercentCalculator } from "./tool.js";
describe("Biological Efficiency %", () => {
  it("calculates a valid result", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 500,
        substrateDryMassG: 1000,
      }),
    ).toEqual({
      ok: true,
      output: { biologicalEfficiencyPercent: 50 },
    }));
  it("returns zero efficiency without mushrooms", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 0,
        substrateDryMassG: 800,
      }),
    ).toEqual({ ok: true, output: { biologicalEfficiencyPercent: 0 } }));
  it("supports full biological efficiency", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 1000,
        substrateDryMassG: 1000,
      }),
    ).toEqual({ ok: true, output: { biologicalEfficiencyPercent: 100 } }));
  it("supports efficiency above one hundred percent", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 1500,
        substrateDryMassG: 1000,
      }),
    ).toEqual({ ok: true, output: { biologicalEfficiencyPercent: 150 } }));
  it("handles fractional masses", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 12.5,
        substrateDryMassG: 250,
      }),
    ).toEqual({ ok: true, output: { biologicalEfficiencyPercent: 5 } }));
  it("rejects zero substrate", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 1,
        substrateDryMassG: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative substrate", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: 1,
        substrateDryMassG: -5,
      }).ok,
    ).toBe(false));
  it("rejects negative mushroom mass", () =>
    expect(
      runBiologicalEfficiencyBePercentCalculator({
        freshMushroomMassG: -1,
        substrateDryMassG: 100,
      }).ok,
    ).toBe(false));
});
