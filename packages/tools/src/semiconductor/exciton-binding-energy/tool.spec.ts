import { describe, expect, it } from "vitest";
import {
  RYDBERG_EV,
  calculateExcitonBindingEnergy,
  excitonBindingEnergyExample,
  runExcitonBindingEnergy,
} from "./tool.js";

describe("Exciton Binding Energy Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runExcitonBindingEnergy(excitonBindingEnergyExample.input)).toEqual({
      ok: true,
      output: excitonBindingEnergyExample.output,
    });
  });

  it("matches the hydrogenic scaling law", () => {
    expect(RYDBERG_EV).toBe(13.605693122994);
    expect(
      calculateExcitonBindingEnergy({
        reducedMassOverM0: 1,
        relativePermittivity: 2,
      }),
    ).toEqual({ bindingEnergyEv: RYDBERG_EV / 4 });
    expect(
      calculateExcitonBindingEnergy({
        reducedMassOverM0: 0.4,
        relativePermittivity: 11.7,
      }).bindingEnergyEv,
    ).toBe(2 * excitonBindingEnergyExample.output.bindingEnergyEv);
  });

  it("accepts vacuum permittivity and mass ratios above one", () => {
    expect(
      runExcitonBindingEnergy({
        reducedMassOverM0: 1.5,
        relativePermittivity: 1,
      }),
    ).toEqual({
      ok: true,
      output: { bindingEnergyEv: 20.408539684491 },
    });
  });

  it("recovers a finite result when direct arithmetic underflows", () => {
    expect(
      calculateExcitonBindingEnergy({
        reducedMassOverM0: 1e-300,
        relativePermittivity: 1e-100,
      }).bindingEnergyEv,
    ).toBeGreaterThan(0);
  });

  it.each([
    ["reducedMassOverM0", { reducedMassOverM0: 0, relativePermittivity: 5 }],
    ["relativePermittivity", { reducedMassOverM0: 1, relativePermittivity: 0 }],
  ] as const)("rejects an invalid %s", (field, input) => {
    expect(() => calculateExcitonBindingEnergy(input)).toThrow();
    expect(runExcitonBindingEnergy(input)).toMatchObject({
      error: { issues: [{ field }] },
      ok: false,
    });
  });

  it("rejects non-finite and missing inputs", () => {
    expect(
      runExcitonBindingEnergy({
        reducedMassOverM0: 1,
        relativePermittivity: Number.NaN,
      }).ok,
    ).toBe(false);
    expect(runExcitonBindingEnergy({ reducedMassOverM0: 1 } as never).ok).toBe(
      false,
    );
  });
});
