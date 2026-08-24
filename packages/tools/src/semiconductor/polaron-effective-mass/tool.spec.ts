import { describe, expect, it } from "vitest";
import {
  calculatePolaronEffectiveMass,
  polaronEffectiveMassExample,
  runPolaronEffectiveMass,
} from "./tool.js";

describe("Polaron Effective Mass Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPolaronEffectiveMass(polaronEffectiveMassExample.input)).toEqual({
      ok: true,
      output: polaronEffectiveMassExample.output,
    }));

  it("returns the bare mass ratio at zero coupling", () =>
    expect(
      runPolaronEffectiveMass({ bareMassRatio: 0.067, frohlichAlpha: 0 }),
    ).toEqual({ ok: true, output: { polaronMassRatio: 0.067 } }));

  it("includes the second-order weak-coupling correction", () =>
    expect(
      calculatePolaronEffectiveMass({
        bareMassRatio: 1,
        frohlichAlpha: 1,
      }),
    ).toEqual({ polaronMassRatio: 1 + 1 / 6 + 0.025 }));

  it("scales proportionally with the bare mass ratio", () => {
    const light = runPolaronEffectiveMass({
      bareMassRatio: 0.067,
      frohlichAlpha: 0.5,
    });
    const heavy = runPolaronEffectiveMass({
      bareMassRatio: 0.134,
      frohlichAlpha: 0.5,
    });
    if (!light.ok || !heavy.ok) throw new Error("expected success");
    expect(heavy.output.polaronMassRatio).toBeCloseTo(
      2 * (light.output.polaronMassRatio as number),
      12,
    );
  });

  it("matches the perturbation formula for GaAs parameters", () =>
    expect(
      runPolaronEffectiveMass({ bareMassRatio: 0.067, frohlichAlpha: 0.068 })
        .ok,
    ).toBe(true));

  it("rejects a zero bare mass ratio", () =>
    expect(
      runPolaronEffectiveMass({ bareMassRatio: 0, frohlichAlpha: 1 }).ok,
    ).toBe(false));

  it("rejects negative mass ratios through schema validation", () =>
    expect(
      runPolaronEffectiveMass({ bareMassRatio: -0.067, frohlichAlpha: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects coupling outside the weak-coupling range", () => {
    expect(
      runPolaronEffectiveMass({ bareMassRatio: 0.067, frohlichAlpha: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runPolaronEffectiveMass({ bareMassRatio: 0.067, frohlichAlpha: 1.01 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects a missing bare mass ratio", () =>
    expect(runPolaronEffectiveMass({ frohlichAlpha: 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    }));

  it("rejects non-finite input", () =>
    expect(
      runPolaronEffectiveMass({
        bareMassRatio: Number.NaN,
        frohlichAlpha: 1,
      }).ok,
    ).toBe(false));
});
