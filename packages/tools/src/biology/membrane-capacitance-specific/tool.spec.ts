import { describe, expect, it } from "vitest";
import {
  membraneCapacitanceSpecificExample,
  runMembraneCapacitanceSpecific,
} from "./tool.js";

describe("Specific Membrane Capacitance", () => {
  it("publishes an executable example", () =>
    expect(
      runMembraneCapacitanceSpecific(membraneCapacitanceSpecificExample.input),
    ).toEqual({
      ok: true,
      output: membraneCapacitanceSpecificExample.output,
    }));
  it("calculates a valid result", () =>
    expect(
      runMembraneCapacitanceSpecific({
        capacitanceMicrofarads: 2,
        membraneAreaCm2: 2,
      }),
    ).toEqual({
      ok: true,
      output: { specificCapacitanceUfPerCm2: 1 },
    }));
  it("scales with smaller area", () =>
    expect(
      runMembraneCapacitanceSpecific({
        capacitanceMicrofarads: 1,
        membraneAreaCm2: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { specificCapacitanceUfPerCm2: 2 },
    }));
  it("matches the canonical one microfarad per square centimetre", () =>
    expect(
      runMembraneCapacitanceSpecific({
        capacitanceMicrofarads: 5e-6,
        membraneAreaCm2: 5e-6,
      }),
    ).toEqual({
      ok: true,
      output: { specificCapacitanceUfPerCm2: 1 },
    }));
  it("rejects zero capacitance", () => {
    const result = runMembraneCapacitanceSpecific({
      capacitanceMicrofarads: 0,
      membraneAreaCm2: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("capacitanceMicrofarads");
  });
  it("rejects zero area", () =>
    expect(
      runMembraneCapacitanceSpecific({
        capacitanceMicrofarads: 1,
        membraneAreaCm2: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative capacitance", () =>
    expect(
      runMembraneCapacitanceSpecific({
        capacitanceMicrofarads: -1,
        membraneAreaCm2: 1,
      }).ok,
    ).toBe(false));
});
