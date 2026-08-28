import { describe, expect, it } from "vitest";
import { runIonicStrength, ionicStrengthExample } from "./tool.js";
describe("Ionic Strength Calculator", () => {
  it("publishes an executable example", () =>
    expect(runIonicStrength(ionicStrengthExample.input)).toEqual({
      ok: true,
      output: ionicStrengthExample.output,
    }));
  it("is symmetric under ion swap", () => {
    const first = runIonicStrength({
      chargeA: 2,
      chargeB: 1,
      concentrationA: 0.2,
      concentrationB: 0.1,
    });
    const second = runIonicStrength({
      chargeA: 1,
      chargeB: 2,
      concentrationA: 0.1,
      concentrationB: 0.2,
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok)
      expect(second.output.ionicStrength).toBe(first.output.ionicStrength);
  });
  it("handles two monovalent ions", () =>
    expect(
      runIonicStrength({
        chargeA: 1,
        chargeB: 1,
        concentrationA: 0.1,
        concentrationB: 0.1,
      }),
    ).toEqual({ ok: true, output: { ionicStrength: 0.1 } }));
  it("weights trivalent charges heavily", () =>
    expect(
      runIonicStrength({
        chargeA: 3,
        chargeB: 3,
        concentrationA: 0.1,
        concentrationB: 0.1,
      }),
    ).toEqual({ ok: true, output: { ionicStrength: 0.9 } }));
  it("allows an absent ion species at zero concentration", () =>
    expect(
      runIonicStrength({
        chargeA: 1,
        chargeB: 1,
        concentrationA: 0,
        concentrationB: 0.1,
      }),
    ).toEqual({ ok: true, output: { ionicStrength: 0.05 } }));
  it("rejects a charge of zero for ion B", () =>
    expect(
      runIonicStrength({
        chargeA: 1,
        chargeB: 0,
        concentrationA: 0.1,
        concentrationB: 0.1,
      }).ok,
    ).toBe(false));
  it("rejects a charge above three for ion A", () =>
    expect(
      runIonicStrength({
        chargeA: 4,
        chargeB: 1,
        concentrationA: 0.1,
        concentrationB: 0.1,
      }).ok,
    ).toBe(false));
});
