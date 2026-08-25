import { describe, expect, it } from "vitest";
import { fitnessRelativeExample, runFitnessRelative } from "./tool.js";

describe("Relative Fitness", () => {
  it("publishes an executable example", () =>
    expect(runFitnessRelative(fitnessRelativeExample.input)).toEqual({
      ok: true,
      output: fitnessRelativeExample.output,
    }));
  it("divides survived offspring by the population maximum", () =>
    expect(
      runFitnessRelative({
        maxSurvivedInPopulation: 90,
        survivedOffspring: 30,
      }),
    ).toEqual({ ok: true, output: { relativeFitnessW: 0.3333333333333333 } }));
  it("yields zero with no surviving offspring", () =>
    expect(
      runFitnessRelative({ maxSurvivedInPopulation: 60, survivedOffspring: 0 }),
    ).toEqual({ ok: true, output: { relativeFitnessW: 0 } }));
  it("yields one for the most fit genotype", () =>
    expect(
      runFitnessRelative({
        maxSurvivedInPopulation: 60,
        survivedOffspring: 60,
      }),
    ).toEqual({ ok: true, output: { relativeFitnessW: 1 } }));
  it("rejects zero maximum survived", () => {
    const result = runFitnessRelative({
      maxSurvivedInPopulation: 0,
      survivedOffspring: 45,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative maximum survived", () => {
    const result = runFitnessRelative({
      maxSurvivedInPopulation: -60,
      survivedOffspring: 45,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative survived offspring", () =>
    expect(
      runFitnessRelative({
        maxSurvivedInPopulation: 60,
        survivedOffspring: -1,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runFitnessRelative({ survivedOffspring: 45 }).ok).toBe(false));
  it("rejects survived offspring above the stated population maximum", () =>
    expect(
      runFitnessRelative({ maxSurvivedInPopulation: 10, survivedOffspring: 11 })
        .ok,
    ).toBe(false));
});
