import { describe, expect, it } from "vitest";
import {
  calculateDesiccantUnitsPerContainerLookup,
  desiccantUnitsPerContainerLookupExample,
  runDesiccantUnitsPerContainerLookup,
} from "./tool.js";

describe("desiccant-units-per-container-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDesiccantUnitsPerContainerLookup(
        desiccantUnitsPerContainerLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: desiccantUnitsPerContainerLookupExample.output,
    });
  });

  it("returns an exact unit count without rounding up when it divides evenly", () => {
    const result = runDesiccantUnitsPerContainerLookup({
      cargoVolumeM3: 10,
      moistureExposureGramsPerM3: 24,
      gramsAbsorbedPerUnit: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.desiccantUnitsNeeded).toBe(20);
  });
  it("rejects non-positive absorption ratings", () => {
    expect(
      runDesiccantUnitsPerContainerLookup({
        cargoVolumeM3: 10,
        moistureExposureGramsPerM3: 20,
        gramsAbsorbedPerUnit: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and unrepresentable requirements", () => {
    expect(() =>
      calculateDesiccantUnitsPerContainerLookup({
        cargoVolumeM3: Number.NaN,
        gramsAbsorbedPerUnit: 12,
        moistureExposureGramsPerM3: 20,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateDesiccantUnitsPerContainerLookup({
        cargoVolumeM3: Number.MAX_VALUE,
        gramsAbsorbedPerUnit: 12,
        moistureExposureGramsPerM3: Number.MAX_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
