import { describe, expect, it } from "vitest";
import {
  moiMultiplicityOfInfectionExample,
  runMoiMultiplicityOfInfection,
} from "./tool.js";

describe("MOI Calculator", () => {
  it("matches the canonical example", () => {
    expect(
      runMoiMultiplicityOfInfection(moiMultiplicityOfInfectionExample.input),
    ).toEqual({ ok: true, output: moiMultiplicityOfInfectionExample.output });
  });
  it("computes fractional multiplicity", () =>
    expect(
      runMoiMultiplicityOfInfection({ virusParticles: 250000, cells: 100000 }),
    ).toEqual({ ok: true, output: { multiplicityOfInfection: 2.5 } }));
  it("allows zero virus particles", () =>
    expect(
      runMoiMultiplicityOfInfection({ virusParticles: 0, cells: 500 }),
    ).toEqual({ ok: true, output: { multiplicityOfInfection: 0 } }));
  it("accepts single cell input", () =>
    expect(
      runMoiMultiplicityOfInfection({ virusParticles: 7, cells: 1 }),
    ).toEqual({ ok: true, output: { multiplicityOfInfection: 7 } }));
  it("rejects zero cells", () =>
    expect(
      runMoiMultiplicityOfInfection({ virusParticles: 10, cells: 0 }).ok,
    ).toBe(false));
  it("rejects negative virus particles", () =>
    expect(
      runMoiMultiplicityOfInfection({ virusParticles: -1, cells: 10 }).ok,
    ).toBe(false));
  it("rejects non-integer particles", () =>
    expect(
      runMoiMultiplicityOfInfection({ virusParticles: 1.5, cells: 3 }).ok,
    ).toBe(false));
});
