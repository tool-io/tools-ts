import { describe, expect, it } from "vitest";
import {
  antennaFarFieldBoundaryExample,
  runAntennaFarFieldBoundary,
} from "./tool.js";

const outputOf = (input: {
  diameterMeters: number;
  wavelengthMeters: number;
}) => {
  const result = runAntennaFarFieldBoundary(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { farFieldBoundaryMeters: number };
};

describe("Far Field Boundary 2", () => {
  it("reproduces the canonical example", () =>
    expect(
      runAntennaFarFieldBoundary(antennaFarFieldBoundaryExample.input),
    ).toEqual({
      ok: true,
      output: { farFieldBoundaryMeters: 16.666666666666668 },
    }));

  it("evaluates two diameters squared over wavelength", () => {
    const { farFieldBoundaryMeters } = outputOf({
      diameterMeters: 2,
      wavelengthMeters: 0.1,
    });
    expect(farFieldBoundaryMeters).toBeCloseTo((2 * 4) / 0.1, 12);
  });

  it("quadruples the boundary when diameter doubles", () => {
    const base = outputOf({
      diameterMeters: 0.5,
      wavelengthMeters: 0.03,
    }).farFieldBoundaryMeters;
    const doubled = outputOf({
      diameterMeters: 1,
      wavelengthMeters: 0.03,
    }).farFieldBoundaryMeters;
    expect(doubled).toBeCloseTo(base * 4, 12);
  });

  it("halves the boundary when wavelength doubles", () => {
    const base = outputOf({
      diameterMeters: 1,
      wavelengthMeters: 0.03,
    }).farFieldBoundaryMeters;
    const longer = outputOf({
      diameterMeters: 1,
      wavelengthMeters: 0.06,
    }).farFieldBoundaryMeters;
    expect(longer).toBeCloseTo(base / 2, 12);
  });

  it("collapses to twice the diameter for a one-wavelength aperture", () =>
    expect(
      outputOf({ diameterMeters: 0.25, wavelengthMeters: 0.25 })
        .farFieldBoundaryMeters,
    ).toBeCloseTo(0.5, 12));

  it("stays finite for very small wavelengths", () =>
    expect(
      Number.isFinite(
        outputOf({ diameterMeters: 3, wavelengthMeters: 1e-9 })
          .farFieldBoundaryMeters,
      ),
    ).toBe(true));

  it("rejects non-positive diameter or wavelength", () => {
    expect(
      runAntennaFarFieldBoundary({ diameterMeters: 0, wavelengthMeters: 0.1 })
        .ok,
    ).toBe(false);
    expect(
      runAntennaFarFieldBoundary({ diameterMeters: 1, wavelengthMeters: 0 }).ok,
    ).toBe(false);
  });
});
